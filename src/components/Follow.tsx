import { Card, Classes, ICardProps, Text } from '@blueprintjs/core'
import * as anime from 'animejs'
import * as _ from 'lodash'
import * as React from 'react'
import { Flipped } from 'react-flip-toolkit'
import styled from 'styled-components'

import FlexContent from 'Components/FlexContent'
import FlexLayout from 'Components/FlexLayout'
import Twitch, { Follower } from 'Libs/Twitch'
import base from 'Styled/base'
import { color, ifProp, size } from 'Utils/styled'

/**
 * Wrapper component.
 */
const Wrapper = styled(Card)<WrapperProps & ICardProps>`
  border: 2px solid ${ifProp({ type: 'stream' }, color('follow.border'), 'transparent')};
  height: ${size('follows.height')};

  &.${Classes.CARD}, .${Classes.DARK} &.${Classes.CARD} {
    background-color: ${ifProp({ type: 'stream' }, color('follow.background'), 'inherit')};
    padding: 10px;
  }
`

/**
 * Preview component.
 */
const Preview = styled.div`
  display: flex;
  justify-content: center;
  height: 45px;
  width: 80px;

  & > img {
    height: 45px;
    object-fit: cover;
    width: 80px;
  }
`

/**
 * Details component.
 */
const Details = styled(FlexContent)`
  padding-left: 10px;
  padding-top: 2px;
`

/**
 * Title component.
 */
const Title = styled(Text)`
  font-size: 0.9rem;
  line-height: 1.4rem;
`

/**
 * Meta component.
 */
const Meta = styled.div`
  color: ${color('follow.meta')};
  font-size: 0.8rem;
  line-height: 1.3rem;

  strong {
    color: ${color('follow.strong')};
    font-weight: normal;
  }
`

/**
 * Follow Component.
 */
export default class Follow extends React.Component<Props> {
  /**
   * Renders the component.
   * @return Element to render.
   */
  public render() {
    const { follow } = this.props

    const isStream = Twitch.isStream(follow)

    let previewUrl: string
    let title: string
    let meta: JSX.Element

    if (Twitch.isStream(follow)) {
      previewUrl = follow.preview.small
      title = follow.channel.status || ''
      meta = (
        <Text ellipsize>
          <strong>{follow.channel.display_name}</strong> - {follow.game} - {follow.viewers.toLocaleString()} viewers
        </Text>
      )
    } else {
      previewUrl = follow.logo
      title = follow.display_name
      meta = (
        <Text ellipsize>{`Last seen ${new Date(follow.updated_at).toLocaleDateString()}${
          !_.isNil(follow.game) ? ` in ${follow.game}` : ''
        }`}</Text>
      )
    }

    return (
      <Flipped flipId={follow._id.toString()} onDelayedAppear={this.onAppear} onExit={this.onExit}>
        <div>
          <Wrapper interactive onClick={this.onClick} type={isStream ? 'stream' : 'follow'}>
            <FlexLayout>
              <Preview>
                <img src={previewUrl} />
              </Preview>
              <Details>
                <Title ellipsize>{title}</Title>
                <Meta>{meta}</Meta>
              </Details>
            </FlexLayout>
          </Wrapper>
        </div>
      </Flipped>
    )
  }

  /**
   * Triggered when the channel is clicked.
   */
  private onClick = () => {
    const { follow, goToChannel } = this.props

    goToChannel(Twitch.isStream(follow) ? follow.channel.name : follow.name)
  }

  /**
   * Triggered when the component appears.
   * @param element - The associated DOM node.
   */
  private onAppear(element: HTMLElement) {
    anime({
      duration: base.follows.flip,
      easing: 'easeOutSine',
      opacity: [0, 1],
      targets: element,
    })
  }

  /**
   * Triggered when the component disappears.
   * @param element - The associated DOM node.
   * @param index - The element index.
   * @param removeElement - The callback to remove the DOM node after the animation.
   */
  private onExit(element: HTMLElement, index: number, removeElement: (anim: anime.AnimeInstance) => void) {
    anime({
      complete: removeElement,
      delay: index,
      duration: base.follows.flip,
      easing: 'easeOutSine',
      opacity: 0,
      targets: element,
    })
  }
}

/**
 * React Props.
 */
interface Props {
  follow: Follower
  goToChannel: (channel: string) => void
}

/**
 * React Props.
 */
interface WrapperProps {
  type: string
}
