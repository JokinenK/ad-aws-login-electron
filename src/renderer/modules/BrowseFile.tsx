import * as React from 'react';
import { default as api } from '../api-instance';
import * as path from 'path-browserify';

export type BrowseFileProps = Omit<
  React.HTMLAttributes<any>,
  'value' |
  'onChange'
> & {
  label?: string;
  value?: string[];
  onChange: (filePaths: string[]) => void;
};

export const BrowseFile = (props: BrowseFileProps) => {
  const {
    value = [],
    label = "Browse",
    onChange,
    ...rest
  } = props;

  const handleFileBrowse = () => {
    api.showOpenDialog({
      defaultPath: value.length
        ? path.dirname(value[0])
        : undefined,
    }).then(({ canceled, filePaths }) => {
      if (!canceled) { onChange(filePaths); }
    });
  }

  return (<input {...rest} type="button" onClick={() => handleFileBrowse()} value={label} />);
};
