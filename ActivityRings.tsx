import { Canvas, Group, Path, Skia } from "@shopify/react-native-skia";
import React, { useEffect, useMemo } from "react";
import { View } from "react-native";
import {
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";

export type RingData = {
  progress: number; // Valor de 0 a 1 (ou mais, caso ultrapasse)
  color: string; // Cor de preenchimento
  backgroundColor: string; // Cor de fundo (trilha)
  label?: string; // Rótulo opcional para o anel
};

export type ActivityRingsProps = {
  data: RingData[];
  size?: number; // Tamanho total do Canvas (largura e altura)
  strokeWidth?: number; // Espessura de cada círculo
  spacing?: number; // Espaçamento entre os círculos
};

/**
 * Subcomponente para renderizar cada anel individualmente,
 * permitindo o uso do `useMemo` para otimização de caminhos Skia.
 */
function Ring({
  ring,
  index,
  center,
  strokeWidth,
  spacing,
  ready,
}: {
  ring: RingData;
  index: number;
  center: number;
  strokeWidth: number;
  spacing: number;
  ready: boolean;
}) {
  const { progress, color, backgroundColor } = ring;
  const radius = center - strokeWidth / 2 - index * (strokeWidth + spacing);

  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    if (!ready) return;
    animatedProgress.value = withDelay(
      index * 150,
      withSpring(progress, {
        damping: 20,
        stiffness: 60,
        mass: 1,
      }),
    );
  }, [progress, index, animatedProgress, ready]);

  const bgPath = useMemo(
    () => Skia.Path.Circle(center, center, Math.max(0, radius)),
    [center, radius],
  );

  const animatedFgPath = useDerivedValue(() => {
    const builder = Skia.PathBuilder.Make();
    if (radius > 0) {
      const rect = {
        x: center - radius,
        y: center - radius,
        width: radius * 2,
        height: radius * 2,
      };
      // Começa no topo (-90 graus) e varre baseado no percurso (animatedProgress * 360)
      builder.addArc(rect, -90, animatedProgress.value * 360);
    }
    return builder.build();
  }, [center, radius]);

  // Se o raio for menor ou igual a 0, os anéis não cabem no espaço disponível
  if (radius <= 0) return null;

  return (
    <Group>
      {/* Trilha de fundo do anel */}
      <Path
        path={bgPath}
        style="stroke"
        strokeWidth={strokeWidth}
        color={backgroundColor}
      />
      {/* Progresso do anel */}
      {progress > 0 && (
        <Path
          path={animatedFgPath}
          style="stroke"
          strokeWidth={strokeWidth}
          color={color}
          strokeCap="round"
          strokeJoin="round"
        />
      )}
    </Group>
  );
}

function ActivityRingsComponent({
  data,
  size = 200,
  strokeWidth = 20,
  spacing = 4,
}: ActivityRingsProps) {
  const center = size / 2;

  return (
    <View style={{ width: size, height: size }}>
      <Canvas style={{ flex: 1 }}>
        {data.map((ring, index) => (
          <Ring
            key={index}
            ring={ring}
            index={index}
            center={center}
            strokeWidth={strokeWidth}
            spacing={spacing}
            ready={true}
          />
        ))}
      </Canvas>
    </View>
  );
}

export const ActivityRings = React.memo(ActivityRingsComponent);
