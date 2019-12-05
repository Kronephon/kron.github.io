LIMIT_PER_PAGE = 100;

//receives a tag and goes through all the posts needed, if empty presents all pending limit

function q(input) {
    console.log(input);
    container_block = document.getElementsByClassName('ArticleFeed')[0];
    block_to_insert = document.createElement( 'div' );
    block_to_insert.innerHTML = 'This demo DIV block was inserted into the page using JavaScript.' ;
    console.log(container_block);
    container_block.appendChild( block_to_insert ); 
}
