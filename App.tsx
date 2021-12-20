import React, {useEffect, useState} from 'react';
import * as S from './App.style';

const MAX_NUMBER_OF_DATA = 8;

const enum Product {
  XBT = 'PI_XBTUSD',
  ETH = 'PI_ETHUSD',
}

type IPrices = Array<Array<number>>;

const App = () => {
  const groups = {
    [Product.XBT]: [0.5, 1, 2.5],
    [Product.ETH]: [0.05, 0.1, 0.25],
  };

  const [product, setProduct] = useState<Product>(Product.XBT);

  const [bids, setBids] = useState<IPrices>([]);
  const [asks, setAsks] = useState<IPrices>([]);
  const [topAskSize, setTopAskSize] = useState(0);
  const [topBidSize, setTopBidSize] = useState(0);

  const [currentGroup, setCurrentGroup] = useState(0.5);

  const ws = new WebSocket('wss://www.cryptofacilities.com/ws/v1');

  useEffect(() => {
    const apiCall = {
      event: 'subscribe',
      feed: 'book_ui_1',
      product_ids: [product],
    };

    ws.onopen = () => {
      ws.send(JSON.stringify(apiCall));
    };

    ws.onmessage = event => {
      const json = JSON.parse(event.data);
      const {asks, bids} = json;
      if (bids?.length > 0) {
        let totalBidSize = 0;
        const newBids = [];

        let currentBids = [...bids];
        // filter array with a maximum number of data we want to receive
        if (currentBids.length > MAX_NUMBER_OF_DATA) {
          currentBids = currentBids.slice(0, MAX_NUMBER_OF_DATA);
        }

        for (const [index, bid] of currentBids.entries()) {
          if (bid) {
            const price = bid[0];
            const size = bid[1];
            if (size > 0) {
              const currentPrice =
                currentGroup * Math.ceil(price / currentGroup);

              //if the current price is the same as previous one we want to merge them
              if (
                currentBids[index - 1] &&
                currentPrice ===
                  currentGroup *
                    Math.ceil(currentBids[index - 1][0] / currentGroup)
              ) {
                const lastBid = currentBids[index - 1];
                lastBid[1] = lastBid[1] + size;
                lastBid[2] = lastBid[2] + size;
                totalBidSize += size;
              } else {
                //otherwise we should push current bid to newBids array with totalBid size as a third value in this array
                bid[0] = currentPrice;
                bid.push(size + totalBidSize);
                newBids.push(bid);
                totalBidSize += size;
              }
            }
          }
        }
        setBids(newBids);
        setTopBidSize(totalBidSize);
      }
      if (asks?.length > 0) {
        let totalAskSize = 0;
        const newAsks = [];

        let currentAsks = [...asks];
        if (currentAsks.length > MAX_NUMBER_OF_DATA) {
          currentAsks = currentAsks.slice(0, MAX_NUMBER_OF_DATA);
        }

        for (const [index, ask] of currentAsks.entries()) {
          if (ask) {
            const price = ask[0];
            const size = ask[1];
            if (size > 0) {
              const currentPrice =
                currentGroup * Math.ceil(price / currentGroup);

              if (
                currentAsks[index - 1] &&
                currentPrice ===
                  currentGroup *
                    Math.ceil(currentAsks[index - 1][0] / currentGroup)
              ) {
                const lastBid = currentAsks[index - 1];
                lastBid[1] = lastBid[1] + size;
                lastBid[2] = lastBid[2] + size;
                totalAskSize += size;
              } else {
                ask[0] = currentPrice;
                ask.push(size + totalAskSize);
                newAsks.push(ask);
                totalAskSize += size;
              }
            }
          }
        }
        setAsks(newAsks);
        setTopAskSize(totalAskSize);
      }
    };
    ws.onerror = e => {
      console.log({e});
    };
    ws.onclose = e => {
      console.log(e.code, e.reason, 'disconnected');
    };
    return () => ws.close();
  }, [product, ws]);

  const onTogglePress = () => {
    if (product === Product.XBT) {
      setProduct(Product.ETH);
      setCurrentGroup(groups[Product.ETH][0]);

      return;
    }
    setProduct(Product.XBT);
    setCurrentGroup(groups[Product.XBT][0]);
  };

  const onKillPress = () => {
    ws.close();
  };

  const onGroupPress = () => {
    const productArr = groups[product];
    const currentIndex = productArr.indexOf(currentGroup);

    if (currentIndex + 1 === productArr.length) {
      setCurrentGroup(productArr[0]);
      return;
    }
    setCurrentGroup(productArr[currentIndex + 1]);
  };

  const renderLevel = (arr: IPrices, color?: string) => {
    return arr?.map(option => {
      const price = option[0];
      const size = option[1];
      const total = option[2];
      const totalLevel = topAskSize > topBidSize ? topAskSize : topBidSize;
      const sizePercentage = Math.round((total / totalLevel) * 100);

      return (
        <S.PriceRow key={price}>
          <S.Bar color={color} width={`${sizePercentage}%`} />
          <S.StyledText>{price}</S.StyledText>
          <S.StyledText>{size}</S.StyledText>
          <S.StyledText>{total}</S.StyledText>
        </S.PriceRow>
      );
    });
  };

  return (
    <S.StyledSafeArea>
      <S.Container>
        <S.Header>
          <S.HeaderText>Orderbook</S.HeaderText>
          <S.CurrentProduct>
            {product === Product.XBT ? 'XBT' : 'ETH'}
          </S.CurrentProduct>
          <S.DropDownWrapper onPress={onGroupPress}>
            <S.DropDownText>Group {currentGroup}</S.DropDownText>
          </S.DropDownWrapper>
        </S.Header>
        <S.SubHeader>
          <S.SubHeaderText>Price</S.SubHeaderText>
          <S.SubHeaderText>Size</S.SubHeaderText>
          <S.SubHeaderText>Total</S.SubHeaderText>
        </S.SubHeader>
        <S.PriceContainer isAsk>{renderLevel(asks, 'red')}</S.PriceContainer>
        <S.PriceContainer>{renderLevel(bids)}</S.PriceContainer>
        <S.ButtonsWrapper>
          <S.Button onPress={onTogglePress}>
            <S.Label>Toggle feed</S.Label>
          </S.Button>
          <S.Button color="#F90716" onPress={onKillPress}>
            <S.Label>Kill feed</S.Label>
          </S.Button>
        </S.ButtonsWrapper>
      </S.Container>
    </S.StyledSafeArea>
  );
};

export default App;
