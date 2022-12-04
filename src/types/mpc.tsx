export interface Site {
  code: string;
  name: string;
  urls: string[];
}

export interface Unit {
  code: string;
  name: {
    [key: string]: string | undefined;
  };
  productCode: string;
  frontDesignCode: string;
  backDesignCode: string;
  width: number;
  height: number;
  dpi: number;
  filter: string;
  auto: boolean;
  scale: number;
  sortNo: number;
  applyMask: boolean;
  maxCards: number;
};
