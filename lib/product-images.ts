const productImageBySlug: Record<string, string> = {
  "giuong-ngu-hkv": "/images/giuong-indochine.png",
  "ghe-may-dong-duong": "/images/dong-duong-product-02.png",
  "ban-an-luna": "/images/product-table-luna.png",
  "giuong-victoria": "/images/product-bed-victoria.png",

  "giuong-cao-cap-dong-duong": "/images/dong-duong-product-01.png",
  "giuong-cao-cap-laura-dong-duong": "/images/dong-duong-product-03.png",
  "giuong-victoria-dong-duong-01": "/images/dong-duong-product-04.png",
  "giuong-a-dong-duong": "/images/dong-duong-product-05.png",
  "ghe-da-dong-duong": "/images/dong-duong-product-06.png",
  "ke-tidi-dong-duong": "/images/dong-duong-product-07.png",
  "giuong-victoria-dong-duong-02": "/images/dong-duong-product-08.png",
  "ban-go-dong-duong": "/images/dong-duong-product-09.png",
  "ghe-cao-cap-dong-duong-01": "/images/dong-duong-product-10.png",
  "ghe-cao-cap-dong-duong-02": "/images/dong-duong-product-11.png",
  "giuong-victoria-dong-duong-03": "/images/dong-duong-product-12.png",

  "giuong-elara-hien-dai": "/images/hien-dai-product-01.png",
  "ghe-luoi-boc-ni-hien-dai": "/images/hien-dai-product-02.png",
  "bo-ban-ghe-an-hien-dai-01": "/images/hien-dai-product-03.png",
  "bo-ban-ghe-an-hien-dai-02": "/images/hien-dai-product-04.png",
  "sofa-mimini-hien-dai": "/images/hien-dai-product-05.png",
  "sofa-hien-dai-01": "/images/hien-dai-product-06.png",
  "sofa-luna-hien-dai": "/images/hien-dai-product-07.png",
  "cau-tuot-tre-em-hien-dai": "/images/hien-dai-product-08.png",
  "sofa-lara-hien-dai": "/images/hien-dai-product-09.png",
  "giuong-hien-dai-01": "/images/hien-dai-product-10.png",
  "ghe-long-cao-cap-hien-dai": "/images/hien-dai-product-11.png",
  "ban-da-cao-cap-hien-dai": "/images/hien-dai-product-12.png",

  "giuong-uhuhu-tan-co-dien": "/images/tan-co-dien-product-01.png",
  "ghe-ngoi-boc-ni-tan-co-dien": "/images/tan-co-dien-product-02.png",
  "ghe-hoang-gia-tan-co-dien": "/images/tan-co-dien-product-03.png",
  "ban-hoang-gia-tan-co-dien": "/images/tan-co-dien-product-04.png",
  "giuong-ahaha-tan-co-dien": "/images/tan-co-dien-product-05.png",
  "bo-ban-ghe-hoi-sieu-cap-tan-co-dien": "/images/tan-co-dien-product-06.png",
  "bo-ban-ghe-sieu-cap-tan-co-dien": "/images/tan-co-dien-product-07.png",
  "sofa-luna-tan-co-dien": "/images/tan-co-dien-product-08.png",
  "ghe-ma-au-tan-co-dien": "/images/tan-co-dien-product-09.png",
  "ban-kinh-tan-co-dien": "/images/tan-co-dien-product-10.png",
  "giuong-suuu-tan-co-dien": "/images/tan-co-dien-product-11.png",
  "ban-long-tan-co-dien": "/images/tan-co-dien-product-12.png",
};

export function getProductImage(slug: string) {
  return productImageBySlug[slug];
}
