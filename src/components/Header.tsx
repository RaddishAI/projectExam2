import styles from "./Header.module.css";

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <h1 className={styles.logo}>Holidaze</h1>
      </div>
    </header>
  );
}

export default Header;