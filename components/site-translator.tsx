"use client";

import { useEffect, useState } from "react";
import { translationPairs } from "@/lib/translations";

type Language = "vi" | "en";

const LANGUAGE_KEY = "hkv-language";
const LANGUAGE_EVENT = "hkv-language-change";

const dictionary = translationPairs;

const exactViToEn: Map<string, string> = new Map(dictionary);
const exactEnToVi: Map<string, string> = new Map(dictionary.map(([vi, en]) => [en, vi]));
const originalTextByNode = new WeakMap<Text, string>();
const originalAttributesByElement = new WeakMap<HTMLElement, Map<string, string>>();

function getStoredLanguage(): Language {
  if (typeof window === "undefined") return "vi";
  return localStorage.getItem(LANGUAGE_KEY) === "en" ? "en" : "vi";
}

function setStoredLanguage(language: Language) {
  localStorage.setItem(LANGUAGE_KEY, language);
  window.dispatchEvent(new CustomEvent(LANGUAGE_EVENT, { detail: language }));
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function translateValue(value: string, language: Language) {
  const trimmed = value.trim();
  if (!trimmed) return value;

  const exactMap = language === "en" ? exactViToEn : exactEnToVi;
  const exact =
    exactMap.get(trimmed) ??
    [...exactMap].find(([from]) => from.toLocaleLowerCase("vi-VN") === trimmed.toLocaleLowerCase("vi-VN"))?.[1];

  if (exact) {
    return value.replace(trimmed, exact);
  }

  const source = language === "en" ? dictionary : dictionary.map(([vi, en]) => [en, vi] as const);
  const translated = source
    .slice()
    .sort((a, b) => b[0].length - a[0].length)
    .reduce((text, [from, to]) => text.replace(new RegExp(escapeRegExp(from), "gi"), to), value);

  return translated;
}

function translateDocument(language: Language) {
  document.documentElement.lang = language;

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || ["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }

      return node.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });

  const textNodes: Text[] = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode as Text);
  textNodes.forEach((node) => {
    const current = node.textContent ?? "";
    const previousOriginal = originalTextByNode.get(node);
    const previousVi = previousOriginal ? translateValue(previousOriginal, "vi") : "";
    const previousEn = previousOriginal ? translateValue(previousOriginal, "en") : "";
    const original = previousOriginal && (current === previousVi || current === previousEn)
      ? previousOriginal
      : current;
    originalTextByNode.set(node, original);

    const next = translateValue(original, language);
    if (node.textContent !== next) node.textContent = next;
  });

  document.querySelectorAll<HTMLElement>("[placeholder], [aria-label], [alt], [title]").forEach((element) => {
    ["placeholder", "aria-label", "alt", "title"].forEach((attribute) => {
      const value = element.getAttribute(attribute);
      if (!value) return;

      const attributeMap = originalAttributesByElement.get(element) ?? new Map<string, string>();
      const previousOriginal = attributeMap.get(attribute);
      const previousVi = previousOriginal ? translateValue(previousOriginal, "vi") : "";
      const previousEn = previousOriginal ? translateValue(previousOriginal, "en") : "";
      const original = previousOriginal && (value === previousVi || value === previousEn)
        ? previousOriginal
        : value;

      attributeMap.set(attribute, original);
      originalAttributesByElement.set(element, attributeMap);

      const next = translateValue(original, language);
      if (value !== next) element.setAttribute(attribute, next);
    });
  });
}

export function LanguageToggleButton({ className = "" }: { className?: string }) {
  const [language, setLanguage] = useState<Language>("vi");

  useEffect(() => {
    const syncLanguage = () => setLanguage(getStoredLanguage());
    syncLanguage();
    window.addEventListener(LANGUAGE_EVENT, syncLanguage);
    window.addEventListener("storage", syncLanguage);
    return () => {
      window.removeEventListener(LANGUAGE_EVENT, syncLanguage);
      window.removeEventListener("storage", syncLanguage);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => setStoredLanguage(language === "vi" ? "en" : "vi")}
      className={className}
    >
      <span>{language === "vi" ? "Tiếng Việt" : "English"}</span>
      <span aria-hidden="true">›</span>
    </button>
  );
}

export default function SiteTranslator() {
  useEffect(() => {
    let frame = 0;
    const applyLanguage = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => translateDocument(getStoredLanguage()));
    };

    applyLanguage();
    const observer = new MutationObserver(applyLanguage);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["placeholder", "aria-label", "alt", "title"],
      characterData: true,
      childList: true,
      subtree: true,
    });
    window.addEventListener(LANGUAGE_EVENT, applyLanguage);
    window.addEventListener("storage", applyLanguage);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener(LANGUAGE_EVENT, applyLanguage);
      window.removeEventListener("storage", applyLanguage);
    };
  }, []);

  return null;
}

