export type InputFilesType = {
  video?: FileWithMetadata[];
  audio?: FileWithMetadata[];
  image?: FileWithMetadata[];
  other?: FileWithMetadata[];
};

export type FileNameTypes = {
  video?: string[];
  audio?: string[];
  image?: string[];
  other?: string[];
};

export type FileTypes = keyof InputFilesType;

export type FileTransformType = {
  state: 'Move' | 'Insert' | 'Delete';
  position?: number;
  fileObj?: FileWithMetadata;
  type: FileTypes;
  secondPosition?: number;
};

export type FileWithMetadata = {
  file: File;
  preview: string;
  customType: 'video' | 'audio' | 'image' | 'other';
  videoMetadata?: {
    height: number;
    width: number;
    duration: number;
    otherMetadata: any;
  };
};

export type FileConfigType = {
  primaryType: FileTypes | string;
  types: Array<{ name: FileTypes | string; number: { min: number; max: number } }>;
};

export type CustomFileType = {
  name: string;
  type: FileTypes;
};

export type VideoFilesType = Array<FileWithMetadata>;
