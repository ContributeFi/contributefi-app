import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import CustomInput from "./CustomInput";
import { Textarea } from "./ui/textarea";
import FileUpload from "./FileUpload";
import { CreateCommunitySchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createCommunity } from "@/services";
import { useState } from "react";

function CreateCommunityForm() {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(CreateCommunitySchema),
  });

  const { mutate: createCommunityMutation, isPending: createCommunityPending } =
    useMutation({
      mutationFn: (data) => createCommunity(data),
      onSuccess: async (data) => {
        console.log({ data });
        if (data.status === 201) {
          toast.success("Community created successfully");
          reset();
          setOpen(false);
          queryClient.invalidateQueries(["communities"]);
        } else {
          toast.error("Something went wrong");
        }
      },
      onError: (error) => {
        console.error("Error:", error.response.data.message);
        toast.error(error.response.data.message);
      },
    });

  const onSubmit = (data) => {
    console.log(data);
    createCommunityMutation(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="lg" className="w-full">
          Create Community
        </Button>
      </DialogTrigger>
      <DialogContent className="scrollbar-hidden max-h-[calc(100vh-150px)] overflow-scroll bg-white sm:max-w-[668px]">
        <DialogHeader>
          <DialogTitle className="text-left text-[18px] text-[#050215] sm:text-[24px]">
            New Community
          </DialogTitle>
          <DialogDescription className="sr-only">
            Enter the community details here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-5 sm:grid-cols-2"
        >
          <CustomInput
            label="Community Name"
            placeholder="Enter Text"
            type="text"
            error={errors.communityName?.message}
            {...register("communityName")}
          />
          <CustomInput
            label="Community Username"
            placeholder="Enter Text"
            type="text"
            error={errors.communityUsername?.message}
            {...register("communityUsername")}
          />
          <CustomInput
            label="Website"
            placeholder="Paste URL"
            prefix="https://"
            type="text"
            error={errors.websitePage?.message}
            {...register("websitePage")}
          />
          <CustomInput
            label="Github"
            placeholder="Paste URL"
            prefix="https://"
            type="text"
            error={errors.githubPage?.message}
            {...register("githubPage")}
          />
          <CustomInput
            label="Twitter"
            placeholder="Paste URL"
            prefix="https://"
            type="text"
            error={errors.twitterPage?.message}
            {...register("twitterPage")}
          />
          <CustomInput
            label="Instagram"
            placeholder="Paste URL"
            prefix="https://"
            type="text"
            error={errors.instagramPage?.message}
            {...register("instagramPage")}
          />

          {/* <FileUpload
            buttonText="Upload Logo"
            description="Files supported: PNG, JPEG (Optional)"
            accept="image/png, image/jpeg"
          />
          <FileUpload
            buttonText="Upload Cover Photo"
            description="Files supported: PNG, JPEG (Optional)"
            accept="image/png, image/jpeg"
          /> */}

          <Label className="flex flex-col items-start gap-2 font-light text-[#09032A]">
            Community Description
            <Textarea
              className="h-[96px] rounded-[12px] border-none bg-[#F7F9FD] px-4 placeholder:text-sm placeholder:text-[#8791A7] focus:border-none focus:outline-0 focus:outline-none focus-visible:border-none focus-visible:ring-0"
              placeholder="What's the community about?"
              error={errors.communityDescription?.message}
              {...register("communityDescription")}
            />
          </Label>

          <div className="hidden sm:block"></div>
          <div className="hidden sm:block"></div>

          <Button
            disabled={createCommunityPending}
            variant="secondary"
            size="lg"
            type="submit"
          >
            {createCommunityPending ? "Processing" : "Proceed"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateCommunityForm;
