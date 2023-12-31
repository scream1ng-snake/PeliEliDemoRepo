import { Button, Divider, Footer, Popup, Radio, Skeleton, Space, Swiper, Toast } from 'antd-mobile';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useParams } from 'react-router-dom';
import { gurmag_big } from '../../../assets';
import { Page } from '../../components/layout/Page';
import { config } from '../../configuration';
import { logger } from '../../features';
import { replaceImgSrc } from '../../helpers';
import { useStore } from '../../hooks';
import WatchCampaignModal from '../ActionsPage/modals/WatchCampaignModal';
import './MenuPage.css';
import { ItemModal } from './modals/ItemModal';
import { Sections } from './sections';
import * as uuid from 'uuid'

export const MenuPage: React.FC = observer(() => {
  const { mainPage, userStore, actionsPage } = useStore();
  const { selectedCourse, state, categories, dishSearcher } = mainPage; 
  const { allCampaign } = userStore.userState; 
  
  const params = useParams<{
    catVCode: string,
    VCode: string,
  }>()
  
  React.useEffect(() => {
    if(params.VCode && params.catVCode) {
      const targetDish = mainPage.getDishByID(params.VCode)
      if(targetDish) {
        mainPage.watchCourse(targetDish)
      } else {
        logger.error(`Блюда с VCode ${params.VCode} не нашлось!!!`, 'WatchCampaignModal')
      }
    }
  }, [categories.length])
  const [askedAddr, setAskedAddr] = React.useState(0)
  return state === 'COMPLETED'
    ? <Page>
        {selectedCourse &&
          <ItemModal course={selectedCourse} />
        }
        {userStore.needAskAdress 
          ? <Popup 
              visible={userStore.needAskAdress} 
              onMaskClick={() => {
                Toast.show({
                  content: 'Пожалуйста, выберите местоположение',
                  position: 'center',
                })
              }}
              bodyStyle={{
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
                padding:'0 0.5rem 0.5rem 0.5rem'
              }}
            >
              <div>
                <Divider>Выберите вашу домашнюю кухню:</Divider>
                <Radio.Group 
                  onChange={(e) => setAskedAddr(e as number)}
                >
                  <Space direction='vertical' block>
                    {userStore.organizations.map((org) => 
                      <Radio block value={org.Id} key={org.Id}>
                        {org.Name}
                      </Radio>
                    )}
                  </Space>
                </Radio.Group>
                <Button 
                  block 
                  color='primary' 
                  size='large'
                  className="mt-1"
                  onClick={() => {
                    if(askedAddr == 142 || askedAddr == 0) {
                      Toast.show({
                        content: 'Выберите местоположение',
                        position: 'center',
                      })
                    } else {
                      userStore.currentOrg = askedAddr
                    }
                  }}
                >
                  Сохранить
                </Button>
              </div>
            </Popup>
          : null
        }
        <div style={{height: '46px'}} />

        {/* <section className='categories'> 
          <OtziviPopup />
          {dishSearcher.isSearching 
            ? (
              <div key='результаты-поиска' id='searching_result'>
                {dishSearcher.result.length 
                  ? (
                    <Divider contentPosition='left' style={{fontSize: '22px'}}>
                        {`Найдено ${dishSearcher.result.length} блюд`}
                    </Divider>
                  ) : (
                    <Result
                      icon={<SmileOutline />}
                      status='success'
                      title='Сегодня такого блюда в меню нет((('
                      description='В ближающее время блюдо появится в меню'
                    />
                  )
                }
                {
                  dishSearcher.result.length
                    ? (
                      <div className="courses_list">
                        {dishSearcher.result.map((course, index) =>
                          <CourseItemComponent 
                            key={`popular-${course.Name}-${index}`}
                            course={course}
                          />
                        )}
                    </div>
                    ) : null
                }
                
              </div>
            ) : (
              <CapsuleTabs defaultActiveKey={categories[0].VCode + '-' + 0}>
                {categories.map((category, index) => 
                  <CapsuleTabs.Tab 
                    title={category.Name} 
                    key={category.VCode + '-' + index}
                  >
                    <div key={category.VCode + '-' + index} id={String(category.VCode)}>
                      <Divider 
                        contentPosition="left" 
                        style={{fontSize: '22px'}} 
                      >
                        {category.Name}
                      </Divider>
                      <div className="courses_list">
                        {category.CourseList.map((course, index) =>
                          <CourseItemComponent 
                            key={`${category.Name}-${course.Name}-${index}`}
                            course={course}
                          />
                        )}
                      </div>
                    </div>
                  </CapsuleTabs.Tab>
                )}
              </CapsuleTabs>
            )
          }
        </section> */}
        {actionsPage.selectedAction && <WatchCampaignModal campaign={actionsPage.selectedAction} />}
          <Swiper 
            loop
            autoplay
            style={{
              borderRadius: '8px', 
              margin: '0.5rem 0.5rem 1rem 0.5rem',
              width: 'calc(100% - 1rem)'
            }}
          >
            {allCampaign.map((campaign, index) => 
              <Swiper.Item key={index}>
                <img 
                  src={config.apiURL + '/api/v2/image/Disount?vcode=' + campaign.VCode + '&random=' + uuid.v4()} 
                  onError={replaceImgSrc(gurmag_big)} 
                  onClick={() => {
                    actionsPage.watchAction(campaign)
                    // navigate('/actions/' + campaign.VCode)
                  }}
                  style={{
                    objectFit: 'contain',
                    width: '100%',
                    height: 'auto',
                    display: 'flex', 
                    borderRadius: '8px', 
                  }}
                  alt={campaign.Name} 
                />
              </Swiper.Item>
            )}
          </Swiper>
        <Sections.filter />
        <Sections.categories />
        <Footer content='@ 2023 Gurmag All rights reserved'></Footer>
        <div style={{height: '55px'}} />
      </Page>
    : <Page>
      <Skeleton animated style={skeletonStyle} />
      <Skeleton.Title style={{margin: '1rem'}} animated />
      <section className='categories'>
        <div>
          <div className="courses_list">
            {new Array(2).fill(null).map((_, index) => 
              <div className="course_item" key={index}>
                <Skeleton style={{width: '100%'}} />
                <div className='item_bady'>
                  <Skeleton.Title animated />
                  <Skeleton.Paragraph animated />
                  <Skeleton animated />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Page>
})


const skeletonStyle: React.CSSProperties = {
  width: 'calc(100% - 1rem)', 
  height: '180px', 
  margin: '0.5rem', 
  borderRadius: '8px', 
}