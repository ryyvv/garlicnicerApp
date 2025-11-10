import React, { Component } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';


// Import all images using ES6 imports
import Purple1 from '../assets/images/Purple1.jpg';
import Purple2 from '../assets/images/Purple2.jpg';
import Purple3 from '../assets/images/Purple3.jpg';
import Purple4 from '../assets/images/Purple4.jpg';
import Purple5 from '../assets/images/Purple5.jpg';
import Purple6 from '../assets/images/Purple6.jpg';
import Purple7 from '../assets/images/Purple7.jpg';
import Purple8 from '../assets/images/Purple8.jpg';
import Purple9 from '../assets/images/Purple9.jpg';
import Purple10 from '../assets/images/Purple10.jpg';

import Tangle1 from '../assets/images/Tangle1.jpg';
import Tangle2 from '../assets/images/Tangle2.jpg';
import Tangle3 from '../assets/images/Tangle3.jpg';
import Tangle4 from '../assets/images/Tangle4.jpg';
import Tangle5 from '../assets/images/Tangle5.jpg';
import Tangle6 from '../assets/images/Tangle6.jpg';
import Tangle7 from '../assets/images/Tangle7.jpg';
import Tangle8 from '../assets/images/Tangle8.jpg';
import Tangle9 from '../assets/images/Tangle9.jpg';
import Tangle10 from '../assets/images/Tangle10.jpg';
import Tangle12 from '../assets/images/Tangle12.jpg';
import Tangle13 from '../assets/images/Tangle13.jpg';
import Tangle14 from '../assets/images/Tangle14.jpg';
import Tangle15 from '../assets/images/Tangle15.jpg';

import Rootrot1 from '../assets/images/Rootrot1.jpg';
import Rootrot2 from '../assets/images/Rootrot2.jpg';
import Rootrot3 from '../assets/images/Rootrot3.jpg';
import Rootrot4 from '../assets/images/Rootrot4.jpg';
import Rootrot5 from '../assets/images/Rootrot5.jpg';
import Rootrot8 from '../assets/images/Rootrot8.jpg';
import Rootrot9 from '../assets/images/Rootrot9.jpg';
import Rootrot11 from '../assets/images/Rootrot11.jpg';

import Leap1 from '../assets/images/Leap1.jpg';
import Leap2 from '../assets/images/Leap2.jpg';
import Leap3 from '../assets/images/Leap3.jpg';
import Leap4 from '../assets/images/Leap4.jpg';
import Leap5 from '../assets/images/Leap5.jpg';
import Leap6 from '../assets/images/Leap6.jpg';
import Leap7 from '../assets/images/Leap7.jpg';
import Leap8 from '../assets/images/Leap8.jpg';
import Leap9 from '../assets/images/Leap9.jpg';
import Leap10 from '../assets/images/Leap10.jpg';
import Leap11 from '../assets/images/Leap11.jpg';
import Leap12 from '../assets/images/Leap12.jpg';

import Thrips1 from '../assets/images/Thrips1.jpg';
import Thrips2 from '../assets/images/Thrips2.jpg';
import Thrips3 from '../assets/images/Thrips3.jpg';
import Thrips4 from '../assets/images/Thrips4.jpg';
import Thrips5 from '../assets/images/Thrips5.jpg';

import folder1 from '../assets/images/folder1.jpg';
import folder2 from '../assets/images/folder2.jpg';
import folder3 from '../assets/images/folder3.jpg';
import folder4 from '../assets/images/folder4.jpg';
import folder5 from '../assets/images/folder5.jpg';

import Garlicrust1 from '../assets/images/Garlicrust1.jpg';
import Garlicrust2 from '../assets/images/Garlicrust2.jpg';
import Garlicrust3 from '../assets/images/Garlicrust3.jpg';
import Garlicrust4 from '../assets/images/Garlicrust4.jpg';
import Garlicrust5 from '../assets/images/Garlicrust5.jpg';

interface GarlicPestDisease {
  id: number;
  pnd: string;
  name: string;
  imageb: any;
  spname: string;
  description: string[];
  management: string[] | string;
  images: any[];
}

interface GarlicVarietiesProps {
  varieties: GarlicPestDisease[];
  theme: any;
  onVarietyPress?: (variety: GarlicPestDisease) => void;
}

const dataPD: GarlicPestDisease[] =
      [
        {
          id: 1,
          pnd: 'Disease',
          name: 'Purple blotch',
          imageb: Purple1,
          spname: 'Alternaria, Ellis Lif',
          description: [
            'Initial symptoms of purple blotch occurred at bulb initiation stage (development of 9th to 10th leaf) in early and regular planting while during late planting it started to appear during vegetative stage (development of 7th to 8th leaf). It first appear in older leaves as whitish sunken area that elongates and develop purplish centers and later become large and oval with concentric rings surrounded by zones of yellow and later covered with visible fruiting bodies (spores). Older leaves are more susceptible to purple blotch than younger ones. If purple blotch only attack the plant after bulb formation, then yield is not very much affected.',
            'Purple blotch infects garlic fields during periods of warm weather with high relative humidity. The disease spread rapidly reaching a very high damage when the relative humidity is consistently higher than 90% or there is an occurrence of rainfall but did not progress rapidly when the relative humidity is below 85%. There is no occurrence of this disease during the initial or early vegetative stages of the crop even if there is high relative humidity (>90%) and occurrence of rainfall'
          ],
          management: [
            'Avoid planting infected bulbs',
            'Crop Hygiene',
            'rop Rotation', 
            'Early Planting',
            'Good soil drainage',
            'Spray of fungicide when there are heavy rains',
            'Chemical fungicides can be used if infestation is high',
            'Spray at bolting stage especially when there is an occurrence of rainfall and a relative humidity of more than 85%',
            'Spray compost tea (GM tea)',
            'Plant Tolerant Varieties',
          ],
          images: [
            Purple1,
            Purple2,
            Purple3,
            Purple4,
            Purple5,
            Purple6,
            Purple7,
            Purple8,
            Purple9,
            Purple10
          ],
        },
        {
          id: 2,
          pnd: 'Insect Pest',
          name: 'Tangle top ',
          imageb: Tangle1,
          spname: 'Aceria tulipae',
          description: ['Aceria tulipae, locally known as ayam Tangle top is twisting or curling of the leaves, with yellowish or pale green streak. This damage is attributed to virus disease transmitted by mites Aceria Tulipae. Bulb development is slow, and the bulbs are small if the plants are attacked at the early stages of growth.'],
          management: [
            'Stretch the twisted and unextruded young leaves to minimize damage. This operation should be done in the afternoon.',
            'Seed treatment with insecticides for an hour before planting',
            'Overhead irrigation with the use of a sprinkler hose may also minimize infestation',
            'Use of botanical insecticide extract alternate with chemical insecticides if infestation is high and colored (blue) sticky trap.',
            'Always use stickers when spraying and the use of water and soap solution can also be effective in controlling the pest.',
          ],
          images: [
            Tangle1,
            Tangle2,
            Tangle3,
            Tangle4,
            Tangle5,
            Tangle6,
            Tangle7,
            Tangle8,
            Tangle9,
            Tangle10,
            Tangle12,
            Tangle13,
            Tangle14,
            Tangle15
          ],
        },
        {
          id: 3,
          pnd: 'Disease',
          name: 'Bulb/Root rot',
          imageb: Rootrot1,
          spname: 'Fusarium & Sclerotium Species',
          description: [
            'The disease is caused by Fusarium and Sclerotium species. This is a soil borne fungus which attacks the basal part causing yellowing and wilting of the leaves followed by total collapse of the tops.',
            'Root rot disease increases in water-logged soils and it is more prevalent with prolong moisture in the soil.  Incidence is more visible at vegetative stage to bulb initiation stage during early planting  (October) and regular planting (November).  Lesser incidence is observe during late planting.'
          ],
          management:'null',
          images: [
            Rootrot1,
            Rootrot2,
            Rootrot3,
            Rootrot4,
            Rootrot5,
            Rootrot8,
            Rootrot9,
            Rootrot11,
          ],
        },
        {
          id: 4,
          pnd: 'Disease',
          name: 'Cercospora leaf spot ',
          imageb: Leap1,
          spname: 'Cercospora duddiae Welles',
          description: [
            'This disease causes spots on foliage and these spots kill the plant cells. A plant’s yield will be reduced from the limited photosynthetic capacity.',
            'Initial symptoms of the pathogen is observe during bulb development to bulb maturity during early and regular planting, while during late planting symptoms started to appear as early as vegetative stage. Low infection is observed during early planting. During regular planting, a low infection is observed during bulb development.  Like purple blotch infection of the disease is higher during late planting, because it attacked all the different growth stages of the plant.',
            'Cercospora produces spores during warm, humid weather. The spores are transported primarily by wind carried by water or equipment. Favorable conditions such as overhead irrigation and rainy, windy weather increase the rate of spread.'
          ],
          management: [
            'Avoid planting infected bulbs',
            'Crop Hygiene',
            'Crop Rotation',
            'Early Planting',
            'Good soil drainage',
            'Spray of fungicide when there are heavy rains',
            'Chemical fungicides can be used if infestation is high',
            'Spray at bolting stage especially when there is an occurrence of rainfall and a relative humidity of more than 85%',
            'Spray compost tea (GM tea)',
            'Plant Tolerant Varieties',
          ],
          images: [
           Leap1,
           Leap2,
           Leap3,
           Leap4,
           Leap5,
           Leap6,
           Leap7,
           Leap8,
           Leap9,
           Leap10,
           Leap11,
           Leap12
          ],
        },
        {
          id: 5,
          pnd: 'Insect Pest',
          name: 'Thrips',
          imageb: Thrips1,
          spname: 'Thrips tabaci Lindeman',
          description: [
            'Thrips feed under the leaf folds and in the protected inner leaves, both adults and nymphs cause damage. They suck the sap of the plant from younger leaves to the growing points. The older leaves become withered or silvery white blotches/blasted in appearance. Thrips are most prevalent during dry and warmer condition.',
            'Thrips are most damaging when they feed during the early bulbing stage. Thrip damage appeared as early as the development of the 4th leaf (initial stage) when there is a change (low to high) in air temperature.'
          ],
          management: [
            'Early planting in October to November to avoid heavy infestation.',
            'Overhead irrigation with the use of a sprinkler hose may also minimize infestation buy washing off the thrips (Overhead irrigation should be followed by spraying if  infestation is high).',
            'Use of botanical extract  and colored (blue) sticky trap.',
            'Spraying with water and soap solution at high pressure  are also effective.',
            'Make sure that the spray material is getting into the center of the plant where thrips are found.'
          ],
          images: [
           Thrips1,
           Thrips2,
           Thrips3,
           Thrips4,
           Thrips5,
          ]

        },
        {
          id: 6,
          pnd: 'Insect Pest',
          name: 'Leaf Folder     ',
          imageb: folder1,
          spname: 'Homona coffearia',
          description: ['Leaf folder larvae make leaf net by webbing the leaves using silken threads and feed from the inside leaf net. Young larva prefers tender leaves while older larva is seen in the mature leaves. Leaf folder can be observed regardless of planting dates, and varieties during vegetative and bulbing stages.  '],
          management: 'null',
          images: [
            folder1,
            folder2,
            folder3,
            folder4,
            folder5,
          ],
        },
        {
          id: 7,
          pnd: 'Disease',
          name: 'Garlic rust',
          imageb: Garlicrust1,
          spname: 'Rust',
          description: ['Disease'],
          management: 'null',
          images: [
            Garlicrust1,
            Garlicrust2,
            Garlicrust3,
            Garlicrust4,
            Garlicrust5,
          ],
        }

      ];

      
class GarlicVarietiesComponent extends Component<GarlicVarietiesProps> {
  private scrollRefs: { [key: number]: React.RefObject<ScrollView | null> } = {};
  private intervals: { [key: number]: NodeJS.Timeout } = {};

  componentDidMount() {
    setTimeout(() => {
      this.props.varieties.forEach((variety) => {
        this.startAutoSlide(variety.id, variety.images.length);
      });
    }, 100);
  }



  startAutoSlide = (varietyId: number, imageCount: number) => {
    let currentIndex = 0;
    this.intervals[varietyId] = setInterval(() => {
      const scrollRef = this.scrollRefs[varietyId];
      if (scrollRef?.current) {
        currentIndex = (currentIndex + 1) % imageCount;
        scrollRef.current.scrollTo({ y: currentIndex * 150, animated: true });
      }
    }, 3000);
  };

  render() {
    const { varieties, theme, onVarietyPress } = this.props;
    
    varieties.forEach((variety) => {
      if (!this.scrollRefs[variety.id]) {
        this.scrollRefs[variety.id] = React.createRef<ScrollView>();
      }
    });

    return (
      <View style={{ marginTop: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 15, paddingHorizontal: 20 }}>
          Pests & Diseases
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 20 }}>
          {varieties.map((variety: GarlicPestDisease) => (
            <TouchableOpacity
              key={variety.id}
              onPress={() => onVarietyPress?.(variety)}
              style={{
                marginRight: 15,
                marginBottom: 15,
                backgroundColor: theme.tertiary,
                borderRadius: 12,
                width: 310,
                height: 150,
                shadowColor: '#000',
                shadowOffset: { width: 1, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 7,
                flexDirection: 'row'
              }}
            >
              <View style={{ width: 160, padding: 15 }}>
                <View style={{
                  backgroundColor: variety.pnd === 'Disease' ? '#ff6b6b' : '#4ecdc4',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                  alignSelf: 'flex-start',
                  marginBottom: 10
                }}>
                  <Text style={{ fontSize: 10, color: '#fff', fontWeight: 'bold' }}>
                    {variety.pnd}
                  </Text>
                </View>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text }}>
                  {variety.spname}
                </Text>
                 <Text style={{ paddingTop: 5,fontSize: 10, fontWeight: '300', color: theme.text }} numberOfLines={3} ellipsizeMode="tail">
                  {variety.description}
                </Text>
              </View>
              <View style={{ width: 150, height: 150 }}>
                <ScrollView 
                  ref={this.scrollRefs[variety.id]}
                  showsVerticalScrollIndicator={false}
                  style={{ flex: 1 }}
                  pagingEnabled
                  snapToInterval={150}
                  decelerationRate="fast"
                >
                  {variety.images.map((image, index) => (
                    <Image
                      key={index}
                      source={image}
                      style={{ width: 150, height: 150, borderRadius: 8 }}
                      resizeMode="cover"
                    />
                  ))}
                </ScrollView>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }
}

export const GarlicVarieties = React.memo(GarlicVarietiesComponent);
export const sampleGarlicVarieties = dataPD;