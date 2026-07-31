declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}

declare module "*.css" {
  const classes: Record<string, string>;
  export default classes;
}

declare module "*.png" {
  const value: number | string;
  export default value;
}

declare module "*.jpg" {
  const value: number | string;
  export default value;
}

declare module "*.jpeg" {
  const value: number | string;
  export default value;
}

declare module "*.webp" {
  const value: number | string;
  export default value;
}

declare module "@/global.css";
