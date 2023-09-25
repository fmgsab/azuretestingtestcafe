import { useFieldInfo, UseFieldInfoProps } from '../../hooks/useFieldInfo';

export type SetNameProps = UseFieldInfoProps;

export function SetName(props: SetNameProps) {
  useFieldInfo({ target: 'name', ...props }).then();
  return <></>;
}
