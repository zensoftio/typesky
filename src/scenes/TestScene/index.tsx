import * as React from 'react';
import {Link} from 'react-router-dom';
import i18n from '../../common/translate';
import BaseScene from '../BaseScene';
const styles =require( './index.scss');

export class TestScene extends BaseScene {
  render() {
    return (
      <header>
        <h1>{i18n.t('some.key')}</h1>
        <h1 className={styles.red}>Test scene</h1>
        <Link to="/error">Error</Link>
      </header>
    )
  }
}
