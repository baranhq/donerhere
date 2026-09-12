import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../../@/components/ui/dialog";

type LocationFilterButtonData = {
  children: React.ReactNode;
};

function LocationFilterButton({ children }: LocationFilterButtonData) {
  return (
    <Dialog>
      <div className="flex justify-center">
        <DialogTrigger className="bg-[#ff5a1e] text-white p-[5px] pl-[15px] pr-[15px] w-[300px] rounded-[10px] font-semibold">
          Browse Locations
        </DialogTrigger>
      </div>
      <DialogContent className=" bg-gray-100 rounded-[15px] p-[15px] pt-[40px] w-fit font-semibold text-[16px]">
        <DialogHeader>{children}</DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default LocationFilterButton;
