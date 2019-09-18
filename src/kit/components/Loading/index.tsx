import * as React from 'react';
const styles = require('./index.scss');

export const Loading = () => {
  return <div className={styles.loading_wrapper}><div className={styles.loading} /></div>
};
