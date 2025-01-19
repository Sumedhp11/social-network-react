import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { LogOut } from "lucide-react";

const UserProfilePopup = () => {
  const [toastId, setToastId] = useState<string>("");
  const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);

//   const { mutate: logoutMutation, isPending } = useMutation({
//     mutationFn: logoutAPI,
//     onMutate: () => {
//       const id = toast.loading("logging out");
//       setToastId(id);
//     },
//     onSuccess: () => {
//       router.replace("/login");
//       toast.success("Logout Successfully", { id: toastId });
//       setOpenAlertDialog(false);
//     },
//   });
//   const handleLogout = () => {
//     logoutMutation();
//     signOut({
//       redirect: true,
//     });
//   };
  return (
    <AlertDialog open={openAlertDialog} onOpenChange={setOpenAlertDialog}>
      <AlertDialogTrigger asChild>
        <div className="flex items-center gap-4 cursor-pointer hover:bg-gray-300 p-2">
          <LogOut size={23} className="text-gray-800 cursor-pointer" />
          <p className="text-center font-semibold text-sm">Logout</p>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-black">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="font-medium">
            Will See You Soon! 😄
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-200 text-black">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            // onClick={handleLogout}
            // disabled={isPending}
          >
            {/* {isPending ? (
              <div className="flex items-center gap-3">
                <span className="text-white font-medium">Logging Out</span>
                <span>
                  <Loader />
                </span>
              </div>
            ) : (
              "Logout"
            )} */}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UserProfilePopup;
