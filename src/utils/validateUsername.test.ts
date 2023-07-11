import { expect } from 'chai';
import {validateUsername} from './validateUsername';
describe('validateUsername',()=>{
    it('should return null if it is a valid username',()=>{
        
        const result = validateUsername('validusername',/^[a-zA-Z0-9]*$/,'error message');
        expect(result).to.be.null
    })
    it('should return error object if provide username with spaces',()=>{
        const result = validateUsername('validusername-',/^[a-zA-Z0-9]*$/,'Only alphanumeric characters allowed for username');
        expect(result).to.not.be.null 
    })
})