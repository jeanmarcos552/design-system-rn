# Design System — React Native

A themeable, fully-typed component library built for production React Native apps.  
Compound components, variant system, and a consistent token-based theme — all in TypeScript strict mode.

> Used in [Toogether](https://github.com/jeanmarcos552/toogether-app-front) — a collaborative goals & lists app for iOS and Android.

---

<!-- Substitua pelos screenshots reais do app. Recomendo GIF curto (3-5s) de cada grupo -->
<!-- Ferramenta gratuita para gravar GIF do simulador: https://www.cockos.com/licecap/ (Windows) -->

## Components

### Button
5 variants · 3 sizes · icon support · loading state

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
Composable card system. Each sub-component accepts the parent's variant and theme automatically via context prop cloning.

```tsx
<Card.Root variant="elevated">
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
All inputs share a single import with a unified API.

```tsx
import { Input } from '@/components/ui'

<Input.Text
  label="Nome"
  placeholder="Digite seu nome"
  control={control}
  name="name"
/>

<Input.Select
  label="Categoria"
  options={categories}
  control={control}
  name="category"
/>

<Input.Radio
  options={['Sim', 'Não']}
  control={control}
  name="confirmed"
/>

<Input.Date label="Data de início" control={control} name="startDate" />
<Input.Checkbox label="Notificações ativas" control={control} name="notify" />
<Input.TextArea label="Observações" control={control} name="notes" />
```

**Types:** `Text` · `Date` · `Select` · `Radio` · `Checkbox` (Switch) · `TextArea`

---

### Text — Primitive with variants

```tsx
import { Text } from '@/components/ui'

<Text type="titulo">Bem-vindo</Text>
<Text type="subtitulo">Suas metas de hoje</Text>
<Text type="paragrafo">Adicione itens à sua lista compartilhada.</Text>
<Text type="link" onPress={handlePress}>Ver detalhes</Text>
<Text type="small">Atualizado há 2 minutos</Text>
```

**Variants:** `titulo` (20px/700) · `subtitulo` (16px/600) · `paragrafo` · `link` (14px, underline) · `small` (12px)

---

### Layout
Page-level scaffolding with consistent behavior.

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

{/* List states */}
<Layout.Skeleton />   {/* loading */}
<Layout.Empty />      {/* no data */}
<Layout.Error />      {/* error boundary */}
```

**Components:** `Root` · `Header` · `Footer` · `Container` · `Scroll` · `Modal` · `Flatlist` · `SectionList` · `Skeleton` · `Empty` · `Error` · `Separator` · `Title`

---

## Architecture decisions

**Compound components over prop drilling**  
`Card.Root` clones its children and injects `variant`, `theme` and `size` automatically. No need to repeat props at every level.

**Object API for inputs**  
`Input.Text`, `Input.Select`, `Input.Radio` — one import, tree-shakeable, readable at the call site.

**Token-based theme**  
All colors, spacing, and typography reference `@/theme` tokens. Switching between dark/light or white-label themes is a single token swap.

**TypeScript strict throughout**  
Every prop, variant, and size is typed. `ButtonProps`, `TextPropss`, `CardVariant` — no `any`, no implicit types.

---

## Stack

React Native 0.81 · Expo 54 · TypeScript 5.9 (strict) · React Native Reanimated 4 · Skia
