import type { Accept } from 'react-dropzone';
import type { LucideIcon } from 'lucide-react';

export type FieldType =
  | 'select'
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'tel'
  | 'zip'
  | 'date'
  | 'time'
  | 'radio'
  | 'button-radio-group'
  | 'checkbox'
  | 'checkbox-group'
  | 'textarea'
  | 'files'
  | 'custom'
  | 'multi-select'
  | 'row-group'  | 'picture-upload' | 'availability' | 'account-number'
  ;

export type FormFieldValue = unknown;

export type FormValues = Record<string, FormFieldValue>;

interface BaseFormSchema {
  type: 'string' | 'number' | 'boolean' | 'array' | 'enum' | 'date';
  errorMessage?: {
    format?: string;
    minLength?: string;
    maxLength?: string;
    min?: string;
    max?: string;
  };
}

interface StringSchema extends BaseFormSchema {
  type: 'string';
  minLength?: number;
  maxLength?: number;
  format?: 'email' | 'url';
  enum?: string[];
}

interface NumberSchema extends BaseFormSchema {
  type: 'number';
  min?: number;
  max?: number;
}

interface BooleanSchema extends BaseFormSchema {
  type: 'boolean';
}

interface ArraySchema extends BaseFormSchema {
  type: 'array';
  items: FormSchema;
}

interface EnumSchema extends BaseFormSchema {
  type: 'enum';
  enum: [string, ...string[]];
}

interface DateSchema extends BaseFormSchema {
  type: 'date';
}

export type FormSchema = StringSchema | NumberSchema | BooleanSchema | ArraySchema | EnumSchema | DateSchema;

export type FieldOptionObj = { value: string | boolean; label: string };

export type FieldOptions = FieldOptionObj[] | string[];

type FileUploadOptions = { maxSize: number; maxFiles: number; accept?: Accept };

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  defaultValue?: FormFieldValue;
  min?: number;
  max?: number;
  maxDate?: Date;
  minDate?: Date;
  description?: string;
  checkboxLabel?: string;
  heading?: string;
  descriptionToHeading?: string;
  labelDescription?: string;
  /*
   * `options`: Array of options, either static, or dynamically set (if `dynamicOptionsKey` is provided)
   * Set to `null` to indicate fetching dynamic options failed
   */
  options?: FieldOptions | null;
  dynamicOptionsKey?: string; // key to allow looking up dynamic options stored higher up in form context
  component?: React.ComponentType<unknown>;
  icon?: LucideIcon;
  bottomDivider?: boolean;
  bottomContent?: React.ReactNode;
  // add an optional callback to hide bottom content based on form values
  bottomContentHidden?: (values?: FormValues) => boolean;
  subtext?: string;
  schema?: FormSchema;
  subFields?: FieldConfig[];
  fileUploadOptions?: FileUploadOptions;
  hidden?: (values?: FormValues) => boolean;
  disabled?: ((values?: FormValues) => boolean) | boolean;
  onChange?: (values?: FormValues) => void;
  errorMessage?: string;
}

export interface FormActionButtonsConfig {
  continueLabel: string;
  cancelLabel?: string;
  backLabel?: string;
}
