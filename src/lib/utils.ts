import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";
import qs from "query-string";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validFiles(file: any) {
  const imgTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!file.type.startsWith("image")) {
    return {
      status: "error",
      message: "Invalid image.",
      imgUrl: "https://placehold.co/600x400.png",
    };
  }
  if (!imgTypes.includes(file.type)) {
    return {
      status: "error",
      message: "Invalid image format (required type jpeg, jpg and png).",
      imgUrl: URL.createObjectURL(file),
    };
  }
  if (file.size > 1 * 1024 * 1024) {
    return {
      status: "error",
      message: "Image is too large (required size 1mb).",
      imgUrl: URL.createObjectURL(file),
    };
  }
  return {
    status: "success",
    imgUrl: URL.createObjectURL(file),
    fileUpload: file,
  };
}

export function validAudio(file: any) {
  const imgTypes = ["audio/mpeg", "audio/ogg", "audio/wav"];
  if (!file.type.startsWith("audio")) {
    return {
      status: "error",
      message: "Invalid audio.",
    };
  }
  if (!imgTypes.includes(file.type)) {
    return {
      status: "error",
      message: "Invalid audio format (required type mpeg, ogg and wav).",
    };
  }
  if (file.size > 5 * 1024 * 1024) {
    return {
      status: "error",
      message: "Audio is too large (required size 1mb).",
    };
  }
  return {
    status: "success",
    fileUpload: file,
  };
}

export function validVideo(file: any) {
  const imgTypes = ["video/mp4", "video/webm", "video/ogg"];
  if (!file.type.startsWith("video")) {
    return {
      status: "error",
      message: "Invalid video.",
    };
  }
  if (!imgTypes.includes(file.type)) {
    return {
      status: "error",
      message: "Invalid video format (required type mp4, webm and ogg).",
    };
  }
  if (file.size > 5 * 1024 * 1024) {
    return {
      status: "error",
      message: "Video is too large (required size 1mb).",
    };
  }
  return {
    status: "success",
    fileUpload: file,
  };
}

const baseURL = process.env.NEXTAUTH_URL;

export async function dynamicBlurDataUrl(url: string) {
  const base64str = await fetch(
    `${baseURL}/_next/image?url=${url}&w=16&q=75`
  ).then(async (res) =>
    Buffer.from(await res.arrayBuffer()).toString("base64")
  );

  const blurSvg = `
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 5'>
      <filter id='b' color-interpolation-filters='sRGB'>
        <feGaussianBlur stdDeviation='1'/>
      </filter>

      <image preserveAspectRatio='none' filter='url(#b)' x='0' y='0' height='100%' width='100%' href='data:image/webp;base64,${base64str}'/> 
    </svg>
  `;

  const toBase64 = (str: any) =>
    typeof window === "undefined"
      ? Buffer.from(str).toString("base64")
      : window.btoa(str);

  return `data:image/svg+xml;base64,${toBase64(blurSvg)}`;
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export const formatPrice = (price: string) => {
  const amount = parseFloat(price);
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
  return formattedPrice;
};

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

interface RemoveUrlQueryParams {
  params: string;
  keysToRemove: string[];
}

export function formUrlQuery({params, key, value}: UrlQueryParams) {
  const currentUrl = qs.parse(params);
  currentUrl[key] = value;
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {skipNull: true}
  );
}

export function removeKeysFromQuery({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) {
  const currentUrl = qs.parse(params);
  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {skipNull: true}
  );
}
