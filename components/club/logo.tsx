import Image from "next/image";

type LogoProps = {
  size?: "login" | "nav" | "mark" | "hero";
};

export function Logo({ size = "nav" }: LogoProps) {
  if (size === "hero") {
    return (
      <Image
        src="/199x-logo.jpg"
        alt="199X Kadayawan"
        width={900}
        height={600}
        priority
        className="mx-auto h-auto w-full max-w-xl object-contain drop-shadow-[0_0_40px_rgba(34,197,94,0.25)]"
      />
    );
  }

  if (size === "login") {
    return (
      <Image
        src="/199x-logo.jpg"
        alt="199X Kadayawan"
        width={720}
        height={480}
        priority
        className="mx-auto h-auto w-full max-w-sm object-contain"
      />
    );
  }

  if (size === "mark") {
    return (
      <Image
        src="/199x-logo.jpg"
        alt="199X"
        width={48}
        height={48}
        className="h-10 w-10 rounded-lg object-cover"
      />
    );
  }

  return (
    <Image
      src="/199x-logo.jpg"
      alt="199X Kadayawan"
      width={220}
      height={146}
      className="h-auto w-full object-contain"
    />
  );
}
