import { Classes, ISpinnerProps, Spinner as OriginalSpinner } from '@blueprintjs/core'
import * as React from 'react'

import Center from 'Components/Center'

/**
 * Spinner Component.
 */
const Spinner: React.SFC<ISpinnerProps & Props> = ({ size, large, small, ...props }) => {
  let className: string | undefined

  if (large) {
    className = Classes.LARGE
  } else if (small) {
    className = Classes.SMALL
  } else {
    className = undefined
  }

  return (
    <Center>
      <OriginalSpinner className={className} {...props} />
    </Center>
  )
}

export default Spinner

/**
 * React Props.
 */
type Props = {
  large?: boolean
  small?: boolean
}
