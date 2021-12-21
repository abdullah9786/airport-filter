    //variable declaration
    let globalData
    let data = []
    let sliced
    let x
    let startNum = 0
    let endNum = 4
    let FilterByTopicResult = []
    tbody = document.getElementById('tbody')
    totalResult = document.getElementById('totalResult')
    start = document.getElementById('start')
    end = document.getElementById('end')
    filterSearch = document.getElementById('filterSearch')


    //Fetch data from JSON
    const fetchData = async () => {
        console.log("globalData")
        const response = await fetch('../data/airports.json')
        data = await response.json();
        globalData = data
        x = data
        //when there is only 4 data
        if (globalData.length < 5) {
            document.getElementsByClassName('left-arrow')[0].style.opacity = 0.5
            document.getElementsByClassName('left-arrow')[0].style.cursor = 'not-allowed'
            document.getElementsByClassName('right-arrow')[0].style.opacity = 0.5
            document.getElementsByClassName('right-arrow')[0].style.cursor = 'not-allowed'
        }
        totalResult.innerText = globalData.length
        dataSlicing(0, 4)

    }
    fetchData()

    //4 data to be sliced 
    const dataSlicing = (from, to) => {
        sliced = Object.fromEntries(
            Object.entries(data).slice(startNum, endNum)
        )
        insertData()
    }

    //Inserting Sliced Data to the table
    const insertData = async () => {
        tbody.innerHTML = ''
        console.log(sliced)
        for (let key in sliced) {
            tbody.innerHTML += `
                <tr>
                    <th >${sliced[key].name}</th>
                    <td>${sliced[key].icao}</td>
                    <td>${sliced[key].iata}</td>
                    <td>${sliced[key].elevation}</td>
                    <td>${sliced[key].latitude}</td>
                    <td>${sliced[key].longitude}</td>
                    <td>${sliced[key].type}</td>
                </tr>
              `
        }
    }

    //Handle functionality when right arrow is clicked
    function next() {
        if (endNum < data.length) {
            startNum = startNum + 4
            endNum = endNum + 4
            start.innerText = startNum + 1
            if (endNum >= data.length) {
                end.innerText = data.length
                document.getElementsByClassName('right-arrow')[0].style.opacity = 0.5
                document.getElementsByClassName('right-arrow')[0].style.cursor = 'not-allowed'
            }
            else {
                end.innerText = endNum
            }
        }
        if (startNum != 0) {
            document.getElementsByClassName('left-arrow')[0].style.opacity = 1
            document.getElementsByClassName('left-arrow')[0].style.cursor = 'pointer'
        }
        dataSlicing(startNum, endNum)

    }

    //Handle functionality when right left is clicked
    function previous() {
        if (startNum != 0) {
            startNum = startNum - 4
            endNum = endNum - 4
            start.innerText = startNum + 1
            end.innerText = endNum
            if (startNum == 0) {
                document.getElementsByClassName('left-arrow')[0].style.opacity = 0.5
                document.getElementsByClassName('left-arrow')[0].style.cursor = 'not-allowed'
            }
            dataSlicing(startNum, endNum)
        }

        if (endNum < data.length) {
            document.getElementsByClassName('right-arrow')[0].style.opacity = 1
            document.getElementsByClassName('right-arrow')[0].style.cursor = 'pointer'
        }

    }


    //Handle checkbox filter
    $('input[name = types').on('click', function (e) {
        // when all checkbox are unchecked
        if ($('input[name="types"]:checked').length == 0) {
            data = globalData
            totalResult.innerText = globalData.length
            FilterByTopicResult = []
            x=globalData
            combineFiltering(globalData)

        }
        //onChecked
        else if (e.target.checked) {
            let filterRes = globalData.filter((elem) => {
                return e.target.value == elem.type
            })
            FilterByTopicResult = [...FilterByTopicResult, ...filterRes]
            data = FilterByTopicResult
            totalResult.innerText = FilterByTopicResult.length
            x=FilterByTopicResult
            combineFiltering(FilterByTopicResult)
        }
        //onUnChecked
        else {
            let filterRes = FilterByTopicResult.filter((elem) => {
                return e.target.value != elem.type
            })

            FilterByTopicResult = [...filterRes]
            data = FilterByTopicResult
            totalResult.innerText = FilterByTopicResult.length
            x=FilterByTopicResult
            combineFiltering(FilterByTopicResult)

        }
    });

    //Handle on dynamic Search
    $(filterSearch).on('change keyup paste', function(){
        combineFiltering(x)
    })


    //Combine data from the both filters
    const combineFiltering = (args) => {
        console.log(args)
        //Use only return in filter because browser will take time if any other functionality will be done with a long objects
        let searchFilterRes = args.filter((elem) => {
            return (
                `${elem.name}`.toLowerCase().includes(`${filterSearch.value}`.toLowerCase()) == true ||
                `${elem.city}`.toLowerCase().includes(`${filterSearch.value}`.toLowerCase()) == true ||
                `${elem.country}`.toLowerCase().includes(`${filterSearch.value}`.toLowerCase()) == true ||
                `${elem.iata}`.toLowerCase().includes(`${filterSearch.value}`.toLowerCase()) == true ||
                `${elem.icao}`.toLowerCase().includes(`${filterSearch.value}`.toLowerCase()) == true ||
                `${elem.latitude}`.toLowerCase().includes(`${filterSearch.value}`.toLowerCase()) == true ||
                `${elem.longitude}`.toLowerCase().includes(`${filterSearch.value}`.toLowerCase()) == true ||
                `${elem.altitude}`.toLowerCase().includes(`${filterSearch.value}`.toLowerCase()) == true ||
                `${elem.dst}`.toLowerCase().includes(`${filterSearch.value}`.toLowerCase()) == true ||
                `${elem.tz}`.toLowerCase().includes(`${filterSearch.value}`.toLowerCase()) == true ||
                `${elem.type}`.toLowerCase().includes(`${filterSearch.value}`.toLowerCase()) == true ||
                `${elem.source}`.toLowerCase().includes(`${filterSearch.value}`.toLowerCase()) == true ||
                `${elem.elevation}`.toLowerCase().includes(`${filterSearch.value}`.toLowerCase()))
        })
        console.log(searchFilterRes, 'filterREs')
        data = searchFilterRes
        startNum = 0
        endNum = 4
        start.innerText = startNum + 1

        if(searchFilterRes.length <= 0 ){
            end.innerText = endNum
            start.innerText = 0
            document.getElementsByClassName('right-arrow')[0].style.opacity = 0.5
            document.getElementsByClassName('right-arrow')[0].style.cursor = 'not-allowed'
            document.getElementsByClassName('left-arrow')[0].style.opacity = 0.5
            document.getElementsByClassName('left-arrow')[0].style.cursor = 'not-allowed'
        } 
        if (endNum >= searchFilterRes.length) {
            end.innerText = data.length
            document.getElementsByClassName('right-arrow')[0].style.opacity = 0.5
            document.getElementsByClassName('right-arrow')[0].style.cursor = 'not-allowed'
        } else {
            end.innerText = endNum
            document.getElementsByClassName('right-arrow')[0].style.opacity = 1
            document.getElementsByClassName('right-arrow')[0].style.cursor = 'pointer'
        }
        totalResult.innerText = searchFilterRes.length
        dataSlicing(startNum, endNum)
    }


