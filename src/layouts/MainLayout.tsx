import Header from "../components/Header";
import Footer from "../components/Footer";

type MainLayoutProps = {
  children: React.ReactNode;
};

function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

export default MainLayout;