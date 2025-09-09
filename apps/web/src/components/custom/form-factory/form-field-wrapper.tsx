import { JSX, useEffect } from "react";
import { type UseFormReturn } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { type FieldConfig, type FormValues } from "@/types";
import { FormField as RenderFormField } from "./render-form-field";
import { cn } from "@/lib/utils";

interface FormFieldWrapperProps {
  field: FieldConfig;
  formWrapperClassName?: string;
  formFieldElClass?: string;
  readOnly?: boolean;
  onChange?: (values: FormValues) => void;
  labelWrapperClassName?: string;
  formFieldSubFieldsWrapperClass?: string;
}

const FormFieldWrapper = ({
  field,
  formWrapperClassName,
  formFieldElClass,
  readOnly,
  onChange,
  labelWrapperClassName,
  formFieldSubFieldsWrapperClass,
}: FormFieldWrapperProps): JSX.Element | null => {
  const {
    control,
    setValue,
    watch,
    unregister,
    formState: { errors },
  } = useFormContext() as UseFormReturn<FormValues>;
  const formValues = watch();

  // Logic for fields whose display is configured to be conditional on values from other fields
  const isHidden = field.hidden ? field.hidden(formValues) : false;
  const isDisabled =
    readOnly ||
    (typeof field.disabled === "function"
      ? field.disabled(formValues)
      : Boolean(field.disabled));

  // Add effect to call onChange prop when form values change
  useEffect(() => {
    if (onChange) {
      const timeoutId = setTimeout(() => {
        onChange(formValues);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [formValues]);

  // support showing error coloration on subfields label if one or both have validation error
  const subFieldsHaveError = field.subFields?.some(
    (subfield) => !!errors[subfield.name]
  );

  useEffect(() => {
    if (field.subFields) {
      // Make sure the parent field of any subfields is not picked up by react-hook-form
      unregister(field.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // field.onChange is a callback that can be used to trigger side effects in the parent when the field value changes (e.g. fetching data from an API)
  useEffect(() => {
    if (field.onChange) {
      field.onChange(formValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues[field.name]]);

  // allows setting a default value dynamically - e.g. if select options load from an API response, and one of the values should be set as the default
  useEffect(() => {
    if (field.defaultValue) {
      setValue(field.name, field.defaultValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.defaultValue]);

  if (isHidden) return null;

  // Subfields exist to support UX designs where more than one (generally just 2) fields are rendered side by side in a row, instead of a full-width column
  // There is no effect on the form values data structure (form values object is still flat) - it's purely for UX
  //   if (field.subFields) {
  //     return (
  //       <div className='flex flex-wrap gap-4 items-start mt-6 w-full max-md:max-w-full'>
  //         {field.label && (
  //           <>
  //             <div
  //               className={`flex flex-col items-start w-60 text-sm font-semibold leading-5 max-w-[280px] min-w-[200px] text-emaTextSecondary ${labelWrapperClassName}`}
  //             >
  //               <FormLabel htmlFor={field.name} className={subFieldsHaveError ? 'text-destructive' : ''}>
  //                 {field.label}
  //               </FormLabel>
  //             </div>
  //           </>
  //         )}
  //         <div className='flex flex-col flex-1 shrink text-base leading-6 basis-0 min-w-[240px]'>
  //           <div className={cn(`flex flex-col gap-4 lg:flex-row lg:gap-0 lg:space-x-4`, formFieldSubFieldsWrapperClass)}>
  //             {field.subFields.map((subfield) => (
  //               <FormField
  //                 key={subfield.name}
  //                 control={control}
  //                 name={subfield.name}
  //                 render={({ field: subRhfField }) => (
  //                   <div className='flex flex-col lg:flex-1'>
  //                     {subfield.label && (
  //                       <div className='pb-3 text-sm font-semibold leading-5 text-emaTextSecondary'>
  //                         <FormLabel htmlFor={subfield.name}>{subfield.label}</FormLabel>
  //                       </div>
  //                     )}
  //                     <FormControl className='lg:flex-1'>
  //                       <RenderFormField field={subfield} rhfField={subRhfField} isDisabled={isDisabled} />
  //                     </FormControl>

  //                     <FormMessage customErrorMessage={subfield.errorMessage} className='mt-1' />
  //                   </div>
  //                 )}
  //               />
  //             ))}
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   }

  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: rhfField }) => (
        <>
          <div>
            <div>
              {field.heading ? (
                <h2 className="text-2xl font-semibold mb-2">{field.heading}</h2>
              ) : null}
            </div>
            <div>
              {field.descriptionToHeading ? (
                <div className="text-emaTextSecondary">
                  {field.descriptionToHeading}
                </div>
              ) : null}
            </div>
          </div>
          <div
            className={cn(
              `flex flex-wrap gap-4 items-start mt-4 w-full max-md:max-w-full`,
              formWrapperClassName
            )}
          >
            <div className="flex flex-col">
              {field.label && (
                <div
                  className={cn(
                    "flex flex-col items-start w-60 text-sm font-semibold leading-5 max-w-[280px] min-w-[200px] text-emaTextSecondary",
                    labelWrapperClassName
                  )}
                >
                  <FormLabel htmlFor={field.name}>{field.label}</FormLabel>
                  {field.labelDescription ? (
                    <div className="text-emaTextSecondary font-light text-wrap mt-1 text-sm">
                      {field.labelDescription.split("\n").map((line, index) => (
                        <div className="mb-1" key={index}>
                          {line}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
            <div
              className={cn(
                `flex flex-col flex-1 shrink text-base leading-6 basis-0 min-w-[240px]`,
                formFieldElClass
              )}
            >
              <FormControl>
                <RenderFormField
                  field={field}
                  rhfField={rhfField}
                  isDisabled={isDisabled}
                />
              </FormControl>
              <FormDescription className="mt-2">
                {field.description}
              </FormDescription>
              <FormMessage className="mt-1">{field.errorMessage}</FormMessage>
            </div>
          </div>
        </>
      )}
    />
  );
};

export default FormFieldWrapper;
