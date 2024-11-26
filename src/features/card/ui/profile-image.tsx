import Image from "next/image";

export async function ProfileImage() {
  return (
    <div className="relative flex-shrink-0 w-24 h-24 mt-1 ">
      <Image
        src={"/odin.png"}
        // loader={}
        // blurDataURL={}
        objectFit="cover"
        alt={"Profile name"}
        // placeholder="blur"
        layout="fill"
        className="rounded-full"
      />
    </div>
  );
}
