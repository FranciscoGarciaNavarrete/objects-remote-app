import React, {useState, useEffect} from 'react';
import LiferayApi from '../common/services/liferay/api';
import OpenMap from './OpenMap';

const SearchMap = () => {
    const loading = "Loading...";

    const [communities, setCommunities] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [selectableProvinces, setSelectableProvinces] = useState(<option value={-1}>{loading}</option>);
    const [selectedLocation, setSelectedLocation] = useState({"id": -1, "latitude": 40.363, "longitude": -3.746, "selected": "community"});
    const [pointsInMap, setPointsInMap] = useState([]);
    const [loadingPoints, setLoadingPoints] = useState(false);

    const getCommunities = async () => {
        try {
            const result = await LiferayApi('o/c/communities/');
            setCommunities(result.data.items);
        } catch (error) {
            console.log(error.message);
        }
    }

    const getProvinces = async () => {
        try {
            const result = await LiferayApi('o/c/provinces/');
            setProvinces(result.data.items);
            setSelectableProvinces(result.data.items.map((prov) => <option value={prov.id}>{prov.name}</option>));
        } catch (error) {
            console.log(error.message);
        }
    }

    const updatePointsInMap = async () => {
        try {
            if(selectedLocation.id != -1){
                let query = '';
                if(selectedLocation.selected == "province"){
                    query = encodeURIComponent('r_provincePoint_c_provinceId = ' + selectedLocation.id);
                } else {
                    query = encodeURIComponent('r_communityPoint_c_communityId = ' + selectedLocation.id);
                }
                setLoadingPoints(true);
                await LiferayApi('o/c/points/?search=' + query).then(res => {
                    setPointsInMap(res.data.items);
                    setLoadingPoints(false);
                });
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const updateSelectableProvinces = (id) => {
        if(id == -1){
            setSelectableProvinces(provinces.map((prov) => 
                    <option value={prov.id}>{prov.name}</option>
                )
            );
        } else {
            const aux = provinces.filter(prov =>{
                return prov.r_communityProvince_c_communityId == id;
            });
            const mapped = aux.map((prov) => 
                <option value={prov.id}>{prov.name}</option>
            );

            setSelectableProvinces(mapped);
        }        
    }

    const onComunnityChange = (e) => {
        const id = e.target.value;        
        
        if(id != -1){
            const locationJSON = communities.filter(com => {
                return com.id == id;
            })[0];
            locationJSON.selected = "community";
            setSelectedLocation(locationJSON);
        }        

        updateSelectableProvinces(id);
    }

    const onProvinceChange = (e) => {
        const id = e.target.value;
        
        if(id != -1){
            const locationJSON = provinces.filter(prov => {
                return prov.id == id;
            })[0];
            locationJSON.selected = "province";
            setSelectedLocation(locationJSON);
        }
    }

    useEffect(() => {
        getCommunities();
        getProvinces();
    }, []);

    useEffect(() => {
        updatePointsInMap();
    }, [selectedLocation]);
    
    let communitiesName = <option value={-1}>{loading}</option>;

    if(communities.length > 0){
        communitiesName = communities.map((com) => <option value={com.id}>{com.name}</option>);
    }

    return (
        <div className='search-map row'>
            <div id="search" class="col">
                <div class="row">
                    <div class="col">
                        <div class="row">
                            <p>Autonomous Community</p>
                        </div>
                        <div class="row">
                            <select onChange={(e) => onComunnityChange(e)} id="selectCommunity">
                                <option value='-1' selected>Select an Autonomous Community</option>
                                {communitiesName}
                            </select>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <div class="row">
                            <p>Province</p>
                        </div>
                        <div class="row">
                            <select onChange={(e) => onProvinceChange(e)} id="selectProvince">
                                <option value='-1' selected>Select a Province</option>
                                {selectableProvinces}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div id="map" class="col-9">
                <OpenMap lat={selectedLocation.latitude} long={selectedLocation.longitude} 
                    points={pointsInMap} loadingPoints={loadingPoints}>
                </OpenMap>
            </div>
        </div>
    );
}

export default SearchMap;