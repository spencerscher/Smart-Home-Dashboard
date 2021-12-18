/*
 * A simple React component
 */
import React from 'react';
import './CSS/text_animation.css'

//import './Typing.css'


class Text extends React.Component {
	render() {
		return <div className="content">
			<center>
				Smart Home Hub
			</center>
			<div className="content__container">
				<p className="content__container__text">
					Team:
				</p>
				<ul className="content__container__list">
					<li className="content__container__list__item">Name Here</li>
					<li className="content__container__list__item">Name Here</li>
					<li className="content__container__list__item">Name Here</li>
				</ul>
			</div>
		</div>

	}
}

/*
 * Render the above component into the div#app
 */
export default Text;