import '../styles/globals.css';
import Head from 'next/head';
import Header from '../components/Header';
import bookmarks from '../reducers/bookmarks';
import user from '../reducers/user';
import hiddenArticles from '../reducers/hiddenArticles';

// init store redux
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';

// redux persist imports
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage';

const reducers = combineReducers({ bookmarks, user, hiddenArticles });
const persistConfig = { key: 'tech-news-v2', storage };

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Head>
          <title>Next.js App</title>
        </Head>
        <Header />
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}

export default App;
