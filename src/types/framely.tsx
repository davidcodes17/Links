export interface IframelyResponse {
  url: string;
  meta: {
    site: string;
    author: string;
    title: string;
    description: string;
    canonical: string;
  };
  links: {
    app: {
      html: string;
      type: string;
      rel: string[];
      options?: {
        _showcaption?: {
          label: string;
          value: boolean;
        };
      };
      media?: {
        "max-width"?: number;
        "aspect-ratio"?: number;
        "padding-bottom"?: number;
      };
    }[];
    thumbnail: {
      href: string;
      type: string;
      rel: string[];
      content_length?: number;
      media?: {
        width: number;
        height: number;
      };
    }[];
    icon: {
      href: string;
      rel: string[];
      type: string;
      media?: {
        width?: number;
        height?: number;
      };
    }[];
  };
  rel: string[];
  html: string;
}
