import * as React from 'react';

export type BrowseFileProps = Omit<
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 
  'ref'
> & {
  ref?: React.RefObject<HTMLInputElement>;
  label?: string;
}

export const BrowseFile = (props: BrowseFileProps) => {
  const {
    ref,
    value = [],
    label = "Browse",
    onChange,
    ...rest
  } = props;

  const btnRef = ref || React.createRef<HTMLInputElement>();
  const inputRef = React.createRef<HTMLInputElement>();

  return (
    <>
      <input {...rest} ref={btnRef} type="button" onClick={() => inputRef.current?.click()} value={label} />
      <input type="file" ref={inputRef} style={{ display: 'none' }} onChange={onChange} />
    </>
  );
};
