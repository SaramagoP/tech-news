import Image from 'next/image';
import styles from '../styles/Article.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addBookmark, removeBookmark } from '../reducers/bookmarks';
import { hideArticle } from '../reducers/hiddenArticles';

function Article(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const handleBookmarkClick = () => {
    if (!user.token) {
      // If user is not logged in, return
      return;
    }

    // Check if user can bookmark articles
    fetch(`https://tech-news-be.vercel.app/users/canBookmark/${user.token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.canBookmark) {
          if (props.isBookmarked) {
            dispatch(removeBookmark(props));
          } else {
            dispatch(addBookmark(props));
          }
        }
      });
  };

  let iconStyle = {};
  if (props.isBookmarked) {
    iconStyle = { color: '#E9B959' };
  }

  return (
    <div className={styles.articles}>
      <div className={styles.articleHeader}>
        <h3>{props.title}</h3>
        <FontAwesomeIcon
          onClick={() => handleBookmarkClick()}
          icon={faBookmark}
          className={styles.bookmarkIcon}
          style={iconStyle}
        />
        {props.inBookmarks || (
          <FontAwesomeIcon
            icon={faEyeSlash}
            onClick={() => dispatch(hideArticle(props.title))}
            className={styles.hideIcon}
          />
        )}
      </div>
      <h4 style={{ textAlign: 'right' }}>- {props.author}</h4>
      <div className={styles.divider}></div>
      <Image
        src={props.urlToImage}
        alt={props.title}
        width={600}
        height={314}
      />
      <p>{props.description}</p>
    </div>
  );
}

export default Article;
