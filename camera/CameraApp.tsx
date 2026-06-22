import { Button } from "@/components/ui/Buttons";
import Flex from "@/components/ui/Flex";
import { Layout } from "@/components/ui/Layout";
import { PermissionRequest } from "@/components/ui/PermissionRequest";
import { Colors } from "@/constants/theme";
import { useCamera, UseCameraProps } from "@/hooks/useCamera";
import { theme } from "@/theme";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Linking, StyleSheet } from "react-native";
import { Camera, CameraProps } from "react-native-vision-camera";
import { CameraLoading } from "./CameraLoading";

type CameraFeatureProps = UseCameraProps &
  Partial<CameraProps> & {
    children?: React.ReactNode;
    callback?: (foto: string) => void;
    isLoadingCallback?: boolean;
    ListFooterComponentBefore?: React.ReactNode;
    ListFooterComponentAfter?: React.ReactNode;
  };
export default function CameraApp({
  position,
  children,
  callback,
  isLoadingCallback,
  ListFooterComponentBefore,
  ListFooterComponentAfter,
  ...props
}: CameraFeatureProps) {
  const [permissionState, setPermissionState] = useState<
    "idle" | "requesting" | "denied"
  >("idle");

  const {
    device,
    hasPermission,
    requestPermission,
    isActive,
    cameraRef,
    isLoading,
    handleCapture,
  } = useCamera({ position, ...props });

  const route = useNavigation()

  useEffect(() => {
    let cancelled = false;

    async function ensurePermission() {
      if (!isActive) return;
      if (hasPermission) {
        if (!cancelled) setPermissionState("idle");
        return;
      }

      if (permissionState !== "idle") return;

      setPermissionState("requesting");
      setTimeout(async () => {
        if (cancelled) return;
        const granted = await requestPermission();
        setPermissionState(granted ? "idle" : "denied");
      }, 1000);
    }

    ensurePermission();
    return () => {
      cancelled = true;
    };
  }, [hasPermission, isActive, permissionState, requestPermission]);

  if (permissionState === "requesting") {
    return (
      <PermissionRequest
        iconName="camera"
        title="Acesso à Câmera"
        message="Para escanear QR Codes e capturar fotos, precisamos de acesso à sua câmera."
        onPress={async () => {
          setPermissionState("requesting");
          const granted = await requestPermission();
          setPermissionState(granted ? "idle" : "denied");
        }}
      />
    );
  }

  if (device == null) {
    return (
      <Layout.Error
        showHeader={false}
        mensage={
          "Nenhum dispositivo de câmera encontrado. \n\n Verifique se sua câmera está funcionando corretamente."
        }
      >
        <Button variant="outline" onPress={requestPermission}>
          Tentar Novamente
        </Button>
        <Button variant="link" iconLeft={<AntDesign name="arrow-left" color={theme.colors.secundary} />}
          onPress={() => route.goBack()}>
          Voltar
        </Button>
      </Layout.Error>
    );
  }

  if (!hasPermission) {
    return permissionState === "denied" ? (
      <Layout.Error mensage="Permissão de câmera negada. Por favor, permita o acesso à câmera para usar esta funcionalidade.">
        <Button
          iconLeft={
            <AntDesign name="setting" size={16} color={Colors.primary} />
          }
          variant="outline"
          onPress={() => Linking.openSettings()}
        >
          Abrir Configurações
        </Button>
        <Button
          variant="outline"
          onPress={async () => {
            setPermissionState("requesting");
            const granted = await requestPermission();
            setPermissionState(granted ? "idle" : "denied");
          }}
        >
          Tentar Novamente
        </Button>
      </Layout.Error>
    ) : (
      <PermissionRequest
        iconName="camera"
        title="Acesso à Câmera"
        message="Para escanear QR Codes e capturar fotos, precisamos de acesso à sua câmera."
        onPress={async () => {
          setPermissionState("requesting");
          const granted = await requestPermission();
          setPermissionState(granted ? "idle" : "denied");
        }}
      />
    );
  }

  if (!isActive) {
    return <Layout.Loading color="white" />;
  }

  return (
    <>
      {isLoading && <CameraLoading mensage="Capturando foto..." />}

      {isLoadingCallback && <CameraLoading mensage="Enviando foto..." />}

      <Camera
        style={StyleSheet.absoluteFill}
        {...props}
        device={device}
        isActive={isActive}
        ref={cameraRef}
      />

      {children ?? children}

      {props.photo && (
        <Layout.Footer style={styles.footer}>
          {ListFooterComponentBefore && ListFooterComponentBefore}

          <Flex flex={2}>
            <Layout.Button
              disabled={isLoadingCallback || isLoading}
              isLoading={isLoading}
              iconLeft={<AntDesign name="camera" size={16} color="#fff" />}
              onPress={async () => {
                const foto = await handleCapture();
                if (callback && foto) {
                  return callback(foto);
                }

                throw new Error("Callback de foto não fornecida");
              }}
            >
              Capturar foto
            </Layout.Button>
          </Flex>

          {ListFooterComponentAfter && ListFooterComponentAfter}
        </Layout.Footer>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
  },
});
