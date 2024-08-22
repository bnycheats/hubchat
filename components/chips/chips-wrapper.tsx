import { PropsWithChildren } from 'react';

function ChipsWrapper(props: PropsWithChildren) {
  return <div className="flex flex-wrap items-center gap-3">{props.children}</div>;
}

export default ChipsWrapper;
