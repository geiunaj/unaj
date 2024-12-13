import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import {
  FileInput,
  ImageUp,
  Trash2,
  LoaderCircle,
  Download,
  ExternalLink,
} from "lucide-react";
import { errorToast, successToast } from "@/lib/utils/core.function";
import { changeLogo } from "../services/logo.actions";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { ChangeTitle } from "@/components/TitleUpdater";
import { useQuery } from "@tanstack/react-query";
import api from "../../../../config/api";
import SkeletonTable from "@/components/Layout/skeletonTable";

export function LogoPage() {
  ChangeTitle("Logos");

  const [logoFile, setLogoFile] = useState<File | undefined>(undefined);
  const [logoDarkFile, setLogoDarkFile] = useState<File | undefined>(undefined);
  const [fondoFile, setFondoFile] = useState<File | undefined>(undefined);
  const [fondoDarkFile, setFondoDarkFile] = useState<File | undefined>(
    undefined
  );
  const [loadingLogoFile, setLoadingLogoFile] = useState(false);
  const [loadingLogoDarkFile, setLoadingLogoDarkFile] = useState(false);
  const [loadingFondoFile, setLoadingFondoFile] = useState(false);
  const [loadingFondoDarkFile, setLoadingFondoDarkFile] = useState(false);

  const handleLogo = async () => {
    setLoadingLogoFile(true);
    await changeLogo({
      logo: logoFile,
    })
      .then((response) => {
        console.log(response);
        successToast(response.data.message);
        window.location.reload();
      })
      .catch((error: any) => {
        errorToast(error.response.data.message);
      });
    setLoadingLogoFile(false);
  };

  const logo = useQuery({
    queryKey: ["logoPage"],
    queryFn: async (): Promise<FileResponse> => {
      return (await api.get("/api/logo?type=logo")).data;
    },
    refetchOnWindowFocus: false,
  });

  const logoDark = useQuery({
    queryKey: ["logoDarkPage"],
    queryFn: async (): Promise<FileResponse> => {
      return (await api.get("/api/logo?type=logoDark")).data;
    },
    refetchOnWindowFocus: false,
  });

  const fondo = useQuery({
    queryKey: ["fondoPage"],
    queryFn: async (): Promise<FileResponse> => {
      return (await api.get("/api/logo?type=fondo")).data;
    },
    refetchOnWindowFocus: false,
  });

  const fondoDark = useQuery({
    queryKey: ["fondoDarkPage"],
    queryFn: async (): Promise<FileResponse> => {
      return (await api.get("/api/logo?type=fondoDark")).data;
    },
    refetchOnWindowFocus: false,
  });

  const handleLogoDark = async () => {
    setLoadingLogoDarkFile(true);
    await changeLogo({
      logoDark: logoDarkFile,
    })
      .then((response) => {
        successToast(response.data.message);
      })
      .catch((error: any) => {
        errorToast(error.response.data.message);
      });
    setLoadingLogoDarkFile(false);
    window.location.reload();
  };

  const handleFondo = async () => {
    setLoadingFondoFile(true);
    await changeLogo({
      fondo: fondoFile,
    })
      .then((response) => {
        successToast(response.data.message);
      })
      .catch((error: any) => {
        errorToast(error.response.data.message);
      });
    setLoadingFondoFile(false);
    window.location.reload();
  };

  const handleFondoDark = async () => {
    setLoadingFondoDarkFile(true);
    await changeLogo({
      fondoDark: fondoDarkFile,
    })
      .then((response) => {
        successToast(response.data.message);
      })
      .catch((error: any) => {
        errorToast(error.response.data.message);
      });
    setLoadingFondoDarkFile(false);
    window.location.reload();
  };

  if (
    logo.isLoading ||
    logoDark.isLoading ||
    fondo.isLoading ||
    fondoDark.isLoading
  ) {
    return <SkeletonTable />;
  }

  return (
    <div className="grid grid-cols-2 w-full items-center gap-6 max-w-4xl">
      <Card className="grid w-full items-center gap-4 p-6 bg-muted/50">
        {!logoFile ? (
          <img
            src={logo?.data?.file?.streamLink}
            width={500}
            height={500}
            alt="logo"
            className="w-full max-h-28 object-cover"
          />
        ) : (
          <img
            src={URL.createObjectURL(logoFile)}
            width={500}
            height={500}
            alt="logo"
            className="w-full max-h-28 object-cover"
          />
        )}
        <div className="grid gap-1.5">
          <div className="grid gap-1.5">
            <Label className="text-xs" htmlFor="file">
              Logo
            </Label>
            <Input
              id="file"
              accept="image/*"
              type="file"
              className="text-xs"
              onChange={(e) => {
                const file = e.target.files;
                if (file) {
                  setLogoFile(file[0]);
                }
              }}
            />
          </div>
          <Button
            onClick={() => handleLogo()}
            disabled={loadingLogoFile || !logoFile}
          >
            <LoaderCircle
              className={`h-4 me-2 ${
                loadingLogoFile ? "animate-spin" : "hidden"
              }`}
            />
            Guardar Logo
          </Button>
        </div>
      </Card>

      <Card className="grid w-full items-center gap-4 p-6 bg-muted/50">
        {!logoDarkFile ? (
          <img
            src={logoDark?.data?.file?.streamLink}
            width={500}
            height={500}
            alt="logo"
            className="w-full max-h-28 object-cover"
          />
        ) : (
          <img
            src={URL.createObjectURL(logoDarkFile)}
            width={500}
            height={500}
            alt="logo"
            className="w-full max-h-28 object-cover"
          />
        )}
        <div className="grid gap-1.5">
          <div className="grid gap-1.5">
            <Label htmlFor="file" className="text-xs">
              Logo Tema Oscuro
            </Label>
            <Input
              id="file"
              type="file"
              accept="image/*"
              className="text-xs"
              onChange={(e) => {
                const file = e.target.files;
                if (file) {
                  setLogoDarkFile(file[0]);
                }
              }}
            />
          </div>
          <Button
            onClick={() => handleLogoDark()}
            disabled={loadingLogoDarkFile || !logoDarkFile}
          >
            <LoaderCircle
              className={`h-4 me-2 ${
                loadingLogoDarkFile ? "animate-spin" : "hidden"
              }`}
            />
            Guardar Logo Oscuro
          </Button>
        </div>
      </Card>

      <Card className="grid w-full items-center gap-4 p-6 bg-muted/50">
        {!fondoFile ? (
          <img
            src={fondo?.data?.file?.streamLink}
            width={500}
            height={500}
            alt="logo"
            className="w-full max-h-28 object-cover"
          />
        ) : (
          <img
            src={URL.createObjectURL(fondoFile)}
            width={500}
            height={500}
            alt="logo"
            className="w-full max-h-28 object-cover"
          />
        )}
        <div className="grid gap-1.5">
          <div className="grid gap-1.5">
            <Label htmlFor="file" className="text-xs">
              Fondo
            </Label>
            <Input
              id="file"
              type="file"
              accept="image/*"
              className="text-xs"
              onChange={(e) => {
                const file = e.target.files;
                if (file) {
                  setFondoFile(file[0]);
                }
              }}
            />
          </div>

          <Button
            onClick={() => handleFondo()}
            disabled={loadingFondoFile || !fondoFile}
          >
            <LoaderCircle
              className={`h-4 me-2 ${
                loadingFondoFile ? "animate-spin" : "hidden"
              }`}
            />
            Guardar Fondo
          </Button>
        </div>
      </Card>

      <Card className="grid w-full items-center gap-4 p-6 bg-muted/50">
        {!fondoDarkFile ? (
          <img
            src={fondoDark?.data?.file?.streamLink}
            width={500}
            height={500}
            alt="logo"
            className="w-full max-h-28 object-cover"
          />
        ) : (
          <img
            src={URL.createObjectURL(fondoDarkFile)}
            width={500}
            height={500}
            alt="logo"
            className="w-full max-h-28 object-cover"
          />
        )}
        <div className="grid gap-1.5">
          <div className="grid gap-1.5">
            <Label htmlFor="file" className="text-xs">
              Fondo Tema Oscuro
            </Label>
            <Input
              id="file"
              type="file"
              accept="image/*"
              className="text-xs"
              onChange={(e) => {
                const file = e.target.files;
                if (file) {
                  setFondoDarkFile(file[0]);
                }
              }}
            />
          </div>
          <Button
            onClick={() => handleFondoDark()}
            disabled={loadingFondoDarkFile || !fondoDarkFile}
          >
            <LoaderCircle
              className={`h-4 me-2 ${
                loadingFondoDarkFile ? "animate-spin" : "hidden"
              }`}
            />
            Guardar Fondo Oscuro
          </Button>
        </div>
      </Card>
    </div>
  );
}
