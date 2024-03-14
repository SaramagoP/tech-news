import { useEffect, useState } from 'react';
import Head from 'next/head';
import Article from './Article';
import TopArticle from './TopArticle';
import styles from '../styles/Home.module.css';
import { useSelector } from 'react-redux';

function Home() {
  const bookmarks = useSelector((state) => state.bookmarks.value);
  const hiddenArticles = useSelector((state) => state.hiddenArticles.value);

  const [articlesData, setArticlesData] = useState([]);
  const [topArticle, setTopArticle] = useState({});

  useEffect(() => {
    fetch('https://tech-news-be.vercel.app/articles')
      .then((res) => res.json())
      .then((data) => {
        setTopArticle(data.articles[0]);
        setArticlesData(data.articles.slice(1));
      });
  }, []);

  const filteredArticles = articlesData.filter(
    (data) => !hiddenArticles.includes(data.title)
  );
  const articles = filteredArticles.map((data, i) => {
    const isBookmarked = bookmarks.some(
      (bookmark) => bookmark.title === data.title
    );
    return <Article key={i} {...data} isBookmarked={isBookmarked} />;
  });

  let topArticles;
  if (bookmarks.some((bookmark) => bookmark.title === topArticle.title)) {
    topArticles = <TopArticle {...topArticle} isBookmarked={true} />;
  } else {
    topArticles = <TopArticle {...topArticle} isBookmarked={false} />;
  }

  return (
    <div>
      <Head>
        <title>Tech News - Home</title>
      </Head>

      {topArticles}

      <div className={styles.articlesContainer}>{articles}</div>
    </div>
  );
}

export default Home;
