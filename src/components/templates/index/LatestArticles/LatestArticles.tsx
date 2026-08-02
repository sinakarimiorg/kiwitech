import React from 'react'
import ArticleBox from '../ArticleBox/ArticleBox'
import SectionHeader from '@root/src/components/modules/SectionHeader/SectionHeader'

export default function LatestArticles() {
    return (
        <div>
            <div className='container'>
                <SectionHeader title={'مطالب خواندنی'} desc={'موبولــند مــگ'} btnTitle={'همه مطالب'} btnHref={'/articles/1'} />
                {/* <!-- Blogs --> */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 lg:gap-x-5 gap-y-3.5 sm:gap-y-4">
                <ArticleBox shortName={'best-phone'} img={'/images/articles/phone.jpg'} title={'بهترین گوشی تا پنج میلیون'} date={[{day:'21', month:'تیر', year:'1404'}]}/>
                <ArticleBox shortName={'earn-from-game'} img={'/images/articles/game-article.jpg'} title={'کسب درآمد از بازی!'} date={[{day:'03', month:'آذر', year:'1404'}]}/>
                <ArticleBox shortName={'how-buy-speaker'} img={'/images/articles/speaker.jpg'} title={'راهنمای خرید اسپیکر بلوتوث قابل حمل (10 نکته ی مهم ضروری و کاربردی)'} date={[{day:'28', month:'اردیبهشت', year:'1403'}]}/>
                <ArticleBox shortName={'how-buy-headphon'} img={'/images/articles/headphone.jpg'} title={'راهنمای خرید هندزفری سیمی (خلاصه، مهم و کاربردی)'} date={[{day:'31', month:'مرداد', year:'1403'}]}/>
                </div>
            </div>
        </div>
    )
}
