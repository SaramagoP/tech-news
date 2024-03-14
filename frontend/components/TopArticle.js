import styles from '../styles/Toparticle.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addBookmark, removeBookmark } from '../reducers/bookmarks';

function TopArticle(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const handleBookmarkClick = () => {
    if (!user.token) {
      return;
    }

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
    <div className={styles.topContainer}>
      <img src={props.urlToImage} className={styles.image} alt={props.title} />
      <div className={styles.topText}>
        <h2 className={styles.topTitle}>{props.title}</h2>
        <FontAwesomeIcon
          onClick={() => handleBookmarkClick()}
          icon={faBookmark}
          className={styles.bookmarkIcon}
          style={iconStyle}
        />
        <h4>{props.author}</h4>
        <p>{props.description}</p>
      </div>
    </div>
  );
}

export default TopArticle;
