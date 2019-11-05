import * as React from 'react'
import {action, observable} from 'mobx'
import {observer} from 'mobx-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import AltLeftArrowIcon from '@Components/svg/AltLeftArrowIcon'
import AltRightArrowIcon from '@Components/svg/AltRightArrowIcon'
import moment = require('moment')
import {LocalizationLangs} from '@App/enum/localization'
import {DATE_FORMATS} from '@Const/date-to-string-formats'

const styles = require('./index.scss')

interface Props {
  value: Date | null
  className?: string
  onChange: (date: Date) => void
}

@observer
export class DatePickerComponent extends React.Component<Props> {

  @observable
  isFocused = false

  render() {
    const {className, value, onChange} = this.props
    return (
      <div className={styles['date-picker-wrapper']}>
        <DatePicker
          inline
          timeCaption=''
          showTimeSelect
          selected={value}
          timeFormat='HH:mm'
          timeIntervals={30}
          onChange={onChange}
          minDate={moment().toDate()}
          onInputClick={this.toggleFocus}
          dateFormat={'DD MMMM YYYY, h:mm'}
          onClickOutside={this.toggleFocus}
          dayClassName={() => styles['date-picker__day']}
          className={[styles['date-picker'], className].join(' ')}
          minTime={
            value &&
            moment(value).format(DATE_FORMATS.DAYS) === moment().format(DATE_FORMATS.DAYS) ? moment().add(0, 'hour').toDate() : undefined
          }
          maxTime={
            value &&
            moment(value).format(DATE_FORMATS.DAYS) === moment().format(DATE_FORMATS.DAYS) ? moment().endOf('day').toDate() : undefined
          }
          renderCustomHeader={
            (
              {
                date,
                changeYear,
                changeMonth,
                decreaseMonth,
                increaseMonth,
              }
            ) => (
              <div className={styles['date-picker__header']}>
                <div className={styles['left-arrow']} onClick={decreaseMonth}>
                  <AltLeftArrowIcon/>
                </div>
                <div className={styles['header-month']}>
                  {moment.localeData(LocalizationLangs.EN).months()[date.getMonth()]}
                </div>
                <div className={styles['right-arrow']} onClick={increaseMonth}>
                  <AltRightArrowIcon/>
                </div>
              </div>
            )
          }
        />
      </div>
    )
  }

  @action
  toggleFocus = () => this.isFocused = !this.isFocused
}

export default DatePickerComponent
