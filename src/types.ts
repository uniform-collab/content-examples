export type OpeningHour = {
  day: string;
  open: string;
  close: string;
};

export type Category = {
  name: string;
  id: string;
  slug: string;
}

export type Shop = {
  id: string;
  shopTitle?: string;
  description?: string;
  slug?: string;
  categoryId?: string;
  category?: string;
  subCategory?: string;
  openingHours?: OpeningHour[];
  services?: string[];
  logoImage?: {
    src: string;
  };
  thumbnailImage?: {
    src: string;
  };
  image?: {
    src: string;
  };
  phoneNumber?: string;
  metaDescription?: string;
  pageTitle?: string;
  mapId?: string;
  socialLinks?: {
    x?: string;
    facebook?: string;
  };
};
