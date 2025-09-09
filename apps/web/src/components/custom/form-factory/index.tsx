import * as React from "react";
import {
  useForm,
  type SubmitHandler,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  type FieldConfig,
  type FormValues,
  type FormActionButtonsConfig,
} from "@/types";
import FormFieldWrapper from "./form-field-wrapper";
// import { Turnstile } from '@marsidev/react-turnstile';
import type { AnyObject, ObjectSchema } from "yup";

interface FormFactoryProps {
  fields: FieldConfig[];
  schema: ObjectSchema<AnyObject>;
  onSubmit: SubmitHandler<FieldValues>;
  onCancel?: () => void;
  onBack?: (currentData: FormValues) => void;
  defaultValues?: FormValues;
  actionButtonsConfig?: FormActionButtonsConfig;
  actionButtonsComponent?: React.ReactNode;
  submitDisabled?: boolean;
  //   cloudflareTurnstileCallback?: (token: string) => void;
  formWrapperClassName?: string;
  formFieldElClass?: string;
  readOnly?: boolean;
  onChange?: (values: FormValues) => void;
  labelWrapperClassName?: string;
  formFieldSubFieldsWrapperClass?: string;
}

const FormFactory: React.FC<FormFactoryProps> = ({
  fields,
  schema,
  onSubmit,
  onCancel, // cancel without saving current form data
  onBack, // pass current form data (without validation) to allow parent to persist incomplete step data in multi-step form
  defaultValues, // pre-fill form with existing data, such as when user steps back in a multi-step form
  actionButtonsConfig, // Configure button text, back vs cancel, etc.
  actionButtonsComponent, // allows passing action buttons wrapped in specialized helper components, such as shadcn/ui dialog triggers
  submitDisabled, // disable submit button based on condition in parent
  //   cloudflareTurnstileCallback, // callback to handle Cloudflare Turnstile token
  formWrapperClassName,
  formFieldElClass,
  readOnly = false,
  onChange,
  labelWrapperClassName,
  formFieldSubFieldsWrapperClass,
}) => {
  const form: UseFormReturn<FormValues> = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues ?? {},
  });

  const handleFormChange = (values: FormValues) => {
    onChange?.(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void form.handleSubmit(onSubmit)(e);
        }}
        className="space-y-8"
      >
        {fields.map((field) => (
          <React.Fragment key={field.name}>
            <FormFieldWrapper
              formFieldElClass={formFieldElClass}
              formWrapperClassName={formWrapperClassName}
              field={field}
              readOnly={readOnly}
              onChange={handleFormChange}
              labelWrapperClassName={labelWrapperClassName}
              formFieldSubFieldsWrapperClass={formFieldSubFieldsWrapperClass}
            />
            {field.bottomContentHidden &&
            field.bottomContentHidden(form.getValues())
              ? null
              : field.bottomContent}
            {field.bottomDivider ? (
              <div className="border-b border-gray-200" />
            ) : null}
          </React.Fragment>
        ))}
        {/* {cloudflareTurnstileCallback ? (
          <div className='flex justify-end'>
            <Turnstile
              siteKey={String(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)}
              onSuccess={cloudflareTurnstileCallback}
            />
          </div>
        ) : null} */}
        {actionButtonsComponent ? (
          actionButtonsComponent
        ) : (
          <>
            {actionButtonsConfig ? (
              <div
                className={`flex ${onCancel || onBack ? "justify-between" : "justify-end"}`}
              >
                {onCancel ? (
                  <Button type="button" onClick={onCancel} variant="secondary">
                    {actionButtonsConfig.cancelLabel ?? "Cancel"}
                  </Button>
                ) : null}
                {onBack ? (
                  <Button
                    type="button"
                    onClick={() => {
                      onBack(form.getValues());
                    }}
                    variant="secondary"
                  >
                    {actionButtonsConfig.backLabel ?? "Back"}
                  </Button>
                ) : null}
                <Button type="submit" disabled={submitDisabled}>
                  {actionButtonsConfig.continueLabel}
                </Button>
              </div>
            ) : (
              <Button type="submit" disabled={submitDisabled}>
                Submit
              </Button>
            )}
          </>
        )}
      </form>
    </Form>
  );
};

export default FormFactory;
