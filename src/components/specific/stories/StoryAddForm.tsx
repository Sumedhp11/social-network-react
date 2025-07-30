import { addStoryAPI } from "@/APIs/storyAPIs";
import { Button } from "@/components/ui/button";
import MediaViewer from "@/components/ui/MediaView";
import { cacheKeyStore } from "@/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader, Upload } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface StoryAddFormProps {
  setAddStoryDialogOpen: (open: boolean) => void;
}

const StoryAddForm = ({ setAddStoryDialogOpen }: StoryAddFormProps) => {
  const [story, setStory] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const handleStoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setStory(file);
    }
  };

  const handleCancel = () => {
    setStory(null);
  };

  const { mutate, isPending, error } = useMutation({
    mutationFn: addStoryAPI,
    onSuccess: (data) => {
      toast.success(data.message, { position: "top-right" });
      setStory(null);
      setAddStoryDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: [cacheKeyStore.stories] });
    },
    onError: () => {
      toast.error("Failed to add story", { position: "top-right" });
    },
  });

  const handleStoryUpload = () => {
    if (!story) return;
    const formData = new FormData();
    formData.append("content", story);
    mutate(formData);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 py-6">
      {error && (
        <p className="text-red-500 font-medium text-base mb-4 text-center">
          {error.message}
        </p>
      )}

      {!story ? (
        <>
          <label
            htmlFor="story-picker"
            className="cursor-pointer flex flex-col items-center justify-center w-full max-w-md h-72 border-2 border-dashed border-[#2B3A45] rounded-xl bg-[#1E2B36] hover:bg-[#243442] transition-colors duration-200 gap-4 text-center"
          >
            <Upload size={36} className="text-[#189FF2]" />
            <p className="text-white text-sm font-medium">
              Click to upload a story
            </p>
          </label>
          <input
            id="story-picker"
            type="file"
            onChange={handleStoryChange}
            className="hidden"
          />
        </>
      ) : (
        <div className="w-full max-w-md flex flex-col items-center gap-6">
          <div className="w-full max-h-[250px] overflow-hidden rounded-xl border border-[#2B3A45]">
            <MediaViewer postImage={story} />
          </div>

          <div className="w-full flex justify-end gap-4">
            <Button
              variant="ghost"
              className="bg-white text-black rounded-md hover:bg-neutral-200 px-6 py-2"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              disabled={!story || isPending}
              className="bg-[#189FF2] text-white hover:bg-[#007ad6] rounded-md w-24 px-6 py-2"
              onClick={handleStoryUpload}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader className="animate-spin" size={16} />
                  <span className="text-sm font-semibold">Posting</span>
                </div>
              ) : (
                <span className="text-sm font-semibold">Add</span>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryAddForm;
