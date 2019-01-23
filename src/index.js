import React, { useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {useDebounce} from './use-debounce';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState('characters');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);


  useEffect(
    () => {
      if (debouncedSearchTerm) {
        setIsSearching(true);
        searchCharacters(debouncedSearchTerm, searchType).then(res => {
          setIsSearching(false);
          setResults(res.data.results);
          console.log(res);
        });
      } else{
        setResults([]);
      }
    },
    [debouncedSearchTerm]
  );


  return (
    <div>


      <input
        placeholder="Search Marvel Comics"
        onChange={e => setSearchTerm(e.target.value)}
        />

        {isSearching && <div>Searching...</div>}
        <ol>
        {results.map(result => (
          <li key={result.id}>
            <h4>{result.name}</h4>
            <img
              src={`${result.thumbnail.path}.${result.thumbnail.extension}`}
              />
              {(result.events.available>0)?
              result.events.items.map(event=>
                <p key={event}>{event.name}</p>):
              <p>No event available</p>}
            </li>
        ))}
        </ol>
        </div>
      );
    }


function searchCharacters(search, searchType) {
  const apiKey = 'ddb64a637cccf095183c9ca095824714';
  const queryString = `=${search}&apikey=${apiKey}`;
  let r;
  return fetch(
    `https://gateway.marvel.com/v1/public/${searchType}?nameStartsWith${queryString}`,
    {
      method: 'GET'
    }
  ).then(r => r.json())
  .then(x => x)
};



const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// <a href={`${event.resourceURI}?apikey=ddb64a637cccf095183c9ca095824714`}>
