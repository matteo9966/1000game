import { expect } from 'chai';
import {reachedVoteThreshold} from './reachedVoteCounter';
describe('reachedVoteThreshold',()=>{
    it('should return false if there is only one player',()=>{
        const result = reachedVoteThreshold(1,1);
        expect(result).to.be.false
    })
    it('should return true if there are 2 players and 1 voted',()=>{
        const result = reachedVoteThreshold(2,1);
        expect(result).to.be.true;
    })
    it('should return false if there are 3 players and only one voted',()=>{
        const result = reachedVoteThreshold(3,1);
        expect(result).to.be.false;
    })
    it('should return true if there are 4 players and 2  voted',()=>{
        const result = reachedVoteThreshold(4,2);
        expect(result).to.be.true;
    })
    it('should return true if there are 5 players and 2  voted',()=>{
        const result = reachedVoteThreshold(4,2);
        expect(result).to.be.true;
    })
    it('should return true if there are 6 players and 3 voted',()=>{
        const result = reachedVoteThreshold(6,3);
        expect(result).to.be.true;
    })
    it('should return true if there are 6 players and 2 voted',()=>{
        const result = reachedVoteThreshold(6,2);
        expect(result).to.be.false;
    })

})