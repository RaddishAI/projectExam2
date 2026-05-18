import styles from "./Home.module.css";

function Home() {
  return (
    <main className={styles.main}>
      <h2 className={styles.title}>Welcome to Holidaze</h2>
      <p className={styles.text}>Find your next stay.</p>
    </main>
  );
}

export default Home;