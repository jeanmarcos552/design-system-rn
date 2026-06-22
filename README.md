# Design System — React Native

A themeable, fully-typed component library built for production React Native apps.  
Compound components, variant system, and a consistent token-based theme — all in TypeScript strict mode.

> Used in [Toogether](https://github.com/jeanmarcos552/toogether-app-front) — a collaborative goals & lists app for iOS and Android.

---

<!-- Add GIFs/screenshots here. Recommended: LICEcap (Windows) or Kap (Mac) to record the simulator -->

## Component inventory

| Group | Components |
|---|---|
| **Primitives** | `Text` (5 variants) · `View` · `Flex` · `Icon` |
| **Button** | 5 variants · 3 sizes · icons · loading |
| **Card** | 13 sub-components (compound) |
| **Input** | `Text` · `Date` · `Select` · `Radio` · `Checkbox` · `TextArea` · `RichText` |
| **Layout** | 14 scaffolding components |
| **Formulario** | Form layout with keyboard avoiding + section list |
| **Visualizations** | `ActivityRings` (Skia) · `ProgressBar` (Skia) |
| **Navigation & UX** | `Slide` · `ExternalLink` · `HapticTab` · `ParallaxScrollView` |
| **Camera** | `CameraApp` · `CameraLoading` |

---

## Components

### Button
5 variants · 3 sizes · optional icons · loading state

```tsx
<Button variant="default" size="large" onPress={handleSubmit}>
  Salvar
</Button>

<Button variant="outline" iconLeft="arrow-left" size="medium">
  Voltar
</Button>

<Button isLoading variant="success">
  Confirmar
</Button>
```

**Variants:** `default` · `outline` · `success` · `link` · `dark`  
**Sizes:** `small` · `medium` · `large`

---

### Card — Compound Component
Composable card system. `Card.Root` clones children and injects `variant` and theme automatically — no prop drilling.

```tsx
<Card.Root variant="primary">
  <Card.Header>
    <Card.Icon name="star" />
    <Card.Title>Meta do mês</Card.Title>
    <Card.Badge label="Ativo" />
  </Card.Header>

  <Card.Content>
    <Card.Image source={uri} />
    <Card.Label>Progresso: 70%</Card.Label>
  </Card.Content>

  <Card.Footer>
    <Card.Toggle value={active} onToggle={setActive} />
  </Card.Footer>
</Card.Root>
```

**Sub-components:** `Root` · `Header` · `Footer` · `Content` · `Badge` · `Empty` · `Icon` · `Image` · `Label` · `Loading` · `Press` · `Title` · `Toggle`

---

### Input — Object API
All inputs share a single import. Integrated with React Hook Form via `control` + `name`.

```tsx
import { Input } from './ui/Inputs'

<Input.Text label="Nome" control={control} name="name" />
<Input.Date label="Data de início" control={control} name="startDate" />
<Input.Select label="Categoria" options={categories} control={control} name="category" />
<Input.Radio options={['Sim', 'Não']} control={control} name="confirmed" />
<Input.Checkbox label="Notificações ativas" control={control} name="notify" />
<Input.TextArea label="Observações" control={control} name="notes" />

{/* Rich text editor (TenTap) with read-only viewer */}
<Input.RichText label="Descrição" control={control} name="description" />
<RichTextViewer html={savedHtml} />
```

**Types:** `Text` · `Date` · `Select` · `Radio` · `Checkbox` · `TextArea` · `RichText`

---

### Text — Primitive with variants

```tsx
import Text from './ui/Text'

<Text type="titulo">Bem-vindo</Text>
<Text type="subtitulo">Suas metas de hoje</Text>
<Text type="paragrafo">Adicione itens à sua lista compartilhada.</Text>
<Text type="link" onPress={handlePress}>Ver detalhes</Text>
<Text type="small">Atualizado há 2 minutos</Text>
```

**Variants:** `titulo` (20px/700) · `subtitulo` (16px/600) · `paragrafo` · `link` (14px, underline) · `small` (12px)

---

### Layout
Page-level scaffolding. Handles safe areas, keyboard avoiding, and consistent spacing.

```tsx
<Layout.Root>
  <Layout.Header title="Minhas Metas" />
  <Layout.Scroll>
    <Layout.Container>
      {/* content */}
    </Layout.Container>
  </Layout.Scroll>
  <Layout.Footer>
    <Button>Nova meta</Button>
  </Layout.Footer>
</Layout.Root>

{/* State components */}
<Layout.Skeleton />   {/* shimmer while loading */}
<Layout.Empty />      {/* no data */}
<Layout.Error />      {/* error boundary */}
```

**Components:** `Root` · `Header` · `Footer` · `Container` · `Scroll` · `Modal` · `Flatlist` · `SectionList` · `Skeleton` · `Empty` · `Error` · `Separator` · `Loading` · `Title`

---

### Formulario — Form Layout
Form scaffolding built on `SectionList` + `KeyboardAvoidingView`. Handles iOS/Android keyboard offset differences and pull-to-refresh.

```tsx
<Formulario
  sections={sections}
  refetch={refetch}
  loading={isLoading}
  StickyHeaderComponent={<FilterBar />}
  ListFooterComponent={<Button onPress={submit}>Salvar</Button>}
>
  <Formulario.Header title="Nova meta">
    <IconButton name="info" onPress={openHelp} />
  </Formulario.Header>
</Formulario>
```

---

### ActivityRings — Skia
Apple Watch-style animated activity rings. Uses `@shopify/react-native-skia` + `react-native-reanimated` spring animations with staggered entrance per ring.

```tsx
import { ActivityRings } from './ActivityRings'

<ActivityRings
  size={200}
  strokeWidth={20}
  spacing={4}
  data={[
    { progress: 0.8, color: '#FF375F', backgroundColor: '#3B1A1A' },
    { progress: 0.5, color: '#30D158', backgroundColor: '#1A3B1A' },
    { progress: 1.2, color: '#0A84FF', backgroundColor: '#1A2A3B' }, // overflow supported
  ]}
/>
```

Each ring animates independently with `withDelay` + `withSpring`. Supports overflow (progress > 1).

---

### ProgressBar — Skia
Animated horizontal progress bar with theme-aware color transitions. Respects screen focus via `useFocusEffect`.

```tsx
import { ProgressBar } from './ProgressBar'

<ProgressBar progress={72} />                          // theme colors auto (warning/info/success)
<ProgressBar progress={45} progressColor="#6C63FF" />  // custom color
<ProgressBar progress={100} height={10} useThemeColors={false} />
```

Color logic: `≤30%` → warning · `≤80%` → info · `>80%` → success

---

### Slide — Parallax Carousel

```tsx
import { Slide } from './Slide'

<Slide
  data={banners}
  header="Em destaque"
  height={258}
  autoPlayInterval={4000}
  renderItem={({ item }) => <BannerCard data={item} />}
/>
```

Auto-play pauses when `data.length === 1`. Uses parallax mode with scale 0.94 and offset 50.

---

## Architecture decisions

**Compound components over prop drilling**  
`Card.Root` uses `React.cloneElement` to inject `variant`, `size` and theme into every child. No context, no prop chains.

**Object API for inputs**  
`Input.Text`, `Input.Select`, `Input.Radio` — one import, clearly namespaced, tree-shakeable.

**Token-based theme**  
All colors, spacing, and typography come from `theme/index.ts`. Swap a brand palette in one file and the entire library reflects it.

**TypeScript strict throughout**  
Every prop, variant, and size is explicitly typed. `BackgroundType`, `ButtonProps`, `RingData` — no `any`, no implicit types.

**Skia for smooth visualizations**  
`ActivityRings` and `ProgressBar` render to a `<Canvas>` via `@shopify/react-native-skia`. Animations run on the UI thread via `useDerivedValue` — zero JS bridge overhead.

---

## Theme

All components read from `theme/index.ts`. To adapt to your brand:

```ts
// theme/index.ts
export const theme = {
  background: { primary: '#1B1B1B', danger: '#3B1A1A', ... },
  border:     { primary: '#333333', danger: '#FF4444', ... },
  colors:     { primary: '#6C63FF', success: '#44BB44', ... },
  typography: { titulo: { fontSize: 20, fontWeight: '700' }, ... },
}
```

See [`theme/index.ts`](./theme/index.ts) for the full token interface.

---

## Stack

React Native 0.81 · Expo 54 · TypeScript 5.9 (strict)  
Reanimated 4 · Skia · TenTap Editor · react-native-reanimated-carousel
