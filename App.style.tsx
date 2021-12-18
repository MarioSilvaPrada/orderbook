import styled from 'styled-components';
import {View, Text, SafeAreaView, TouchableOpacity} from 'react-native';

const BACKGROUND_COLOR = '#191919';
const GREY = '#2d4263';
const PURPLE = '#A02A63';

export const StyledSafeArea = styled(SafeAreaView)`
  flex: 1;
`;

export const Header = styled(View)`
  padding: 12px 8px;
  flex-direction: row;
  justify-content: space-between;
  border-bottom-width: 2px;
  border-color: ${GREY};
`;

export const SubHeader = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  padding: 8px;
  border-bottom-width: 1px;
  border-color: ${GREY};
`;

export const SubHeaderText = styled(Text)`
  color: ${GREY};
  font-size: 20px;
`;
export const Container = styled(View)`
  background: ${BACKGROUND_COLOR};
  flex: 1;
`;

export const HeaderText = styled(Text)`
  font-size: 20px;
  color: white;
`;

export const DropDownWrapper = styled(TouchableOpacity)`
  background: ${GREY};
  border-radius: 10px;
  padding: 5px;
`;

export const DropDownText = styled(Text)`
  font-size: 15px;
  color: white;
`;

export const PriceContainer = styled(View)<{isAsk?: boolean}>`
  flex-direction: ${({isAsk}) => (isAsk ? 'column-reverse' : 'column')};
  flex: 1;
`;

export const PriceRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
`;

export const StyledText = styled(Text)`
  padding: 5px;
  color: white;
  font-size: 16px;
`;

export const Bar = styled(View)<{width: string; color?: 'red'}>`
  height: 100%;
  width: ${({width}) => width || 0};
  background-color: ${({color}) => color || 'green'};
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.5;
`;

export const ButtonsWrapper = styled(View)`
  flex-direction: row;
  justify-content: space-evenly;
  padding-bottom: 10px;
`;

export const Button = styled(TouchableOpacity)<{color?: string}>`
  padding: 8px 15px;
  background-color: ${({color}) => color || PURPLE};
  border-radius: 10px;
  width: 40%;
`;

export const Label = styled(Text)`
  font-size: 22px;
  color: white;
  text-align: center;
`;
