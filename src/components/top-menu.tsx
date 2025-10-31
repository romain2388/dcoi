import { Anchor, Box, Header, Nav } from "grommet";

type topMenuProperties = {
  active?: string;
};

export default function TopMenu({ active = "home" }: topMenuProperties) {
  const pages = [
    { id: "home", label: "Home", href: "#home" },
    { id: "page1", label: "Registry", href: "#page1" },
    { id: "page2", label: "Financed Projects", href: "#page2" },
    { id: "page3", label: "Vote 4 next Project", href: "#page3" },
    { id: "page4", label: "The Initiative", href: "#page4" },
    { id: "page5", label: "The Community Wallet", href: "#page5" },
  ];

  return (
    <Header
      pad={{ horizontal: "medium", vertical: "small" }}
      background="transparent"
    >
      <Box direction="row" align="center" gap="small">
        <Box pad="small">Logo</Box>
      </Box>

      <Nav direction="row">
        {pages.map((p) => (
          <Anchor
            key={p.id}
            href={p.href}
            label={p.label}
            color={p.id === active ? "brand" : undefined}
            style={{ textDecoration: p.id === active ? "none" : "underline" }}
          />
        ))}
      </Nav>
    </Header>
  );
}
