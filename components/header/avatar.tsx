import UserDefaultPic from '@/assets/user_pic-225x225.png';
import Image from 'next/image';
import { cn } from '@/lib/utils';

function Avatar(props: AvatarProps) {
  const { className, textClassName, name } = props;
  return (
    <div
      className={cn(
        'relative inline-flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary shadow-inner',
        className,
      )}
    >
      {name ? (
        <span className={cn('font-semibold uppercase text-white', textClassName)}>{name.charAt(0)}</span>
      ) : (
        <Image src={UserDefaultPic} width={36} height={36} alt="default-user-pic" />
      )}
    </div>
  );
}

type AvatarProps = {
  className?: string;
  textClassName?: string;
  name?: string;
};

export default Avatar;
