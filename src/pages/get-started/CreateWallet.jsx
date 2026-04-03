import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import { createWallet } from "@/services";
import { useMutation } from "@tanstack/react-query";
import { useWallet } from "@/hooks/useWallet";

function CreateWallet() {
  const { username } = useAuth();
  const navigate = useNavigate();
  const { setPublicKey, setNetwork, publicKey } = useWallet();

  const network = import.meta.env.VITE_NETWORK;
  const networkPassphrase = import.meta.env.VITE_NETWORK_PASSPHRASE;

  const [status, setStatus] = useState("idle");

  const { mutate: createWalletMutation } = useMutation({
    mutationFn: () => createWallet(network),

    onMutate: () => {
      setStatus("loading");
    },

    onSuccess: (data) => {
      console.log("Create wallet response:", data);

      if (data.status === 200) {
        const { publicKey } = data.data.content;

        setPublicKey(publicKey);
        setNetwork({
          network,
          networkPassphrase,
        });

        toast.success("Wallet created successfully");
        navigate("/get-started/wallet-created-success");
      } else {
        setStatus("error");
        toast.error("Something went wrong");
      }
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to create wallet";

      console.error("Error:", message);
      toast.error(message);
      setStatus("error");
    },
  });

  const hasRun = useRef(false);

  useEffect(() => {
    if (username && !publicKey && !hasRun.current) {
      hasRun.current = true;
      createWalletMutation();
    }
  }, [username, createWalletMutation, publicKey]);

  useEffect(() => {
    if (!username) {
      navigate("/get-started/username");
    }
  }, [username, navigate]);

  useEffect(() => {
    if (publicKey) {
      navigate("/get-started/wallet-created-success");
    }
  }, [publicKey, navigate]);

  const handleRetry = () => {
    createWalletMutation();
  };

  return (
    <div>
      <div className="mb-8 space-y-[8px]">
        <h2 className="text-[24px] font-bold text-[#09032A] md:text-[28px]">
          Create Wallet
        </h2>
        <p className="text-base font-light text-[#525866] md:text-[18px]">
          {status === "error"
            ? "We couldn’t create your wallet"
            : "Please wait while we generate a wallet for you"}
        </p>
      </div>

      <div className="flex justify-center space-y-[32px]">
        {status === "loading" && (
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#1082E4]" />
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <div className="text-sm text-red-500">
              Failed to create wallet. Please try again.
            </div>

            <button
              onClick={handleRetry}
              className="rounded-md bg-[#1082E4] px-4 py-2 text-white"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateWallet;
